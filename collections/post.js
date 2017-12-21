import {
    check
} from 'meteor/check';
//  导出　　ｐｏｓｔ　　表　对象
Posts = new Mongo.Collection('posts');


// 只有自己的帖子　　　才能修改
Posts.allow({

    update: function(userId, post) {
        return ownDocument(userId, post);
    },
    remove: function(userId, post) {
        return ownDocument(userId, post);
    }
});
//   拒绝策略　
Posts.deny({
    update: function(userId, post, fieldNames) {
        //   　在修改的时候　限制字段　　　只允许修改　　ｕｒｌ　　ｔｉｔｌｅ　　字段
        // _without(fieldNames,"url",'title') 　除去这两个字段　　的字段集合　　　如果还是大于０　　　　那说明不符合我们的规则　　　就拒绝
        return　 (_.without(fieldNames, "url", 'title').length > 0);
    },
    // remove: function() {
    //     return (_.without(fieldNames, "url", 'title').length > 0);
    // }
});
// 　内置的方法
Meteor.methods({
    insertInner: function(postAttributes) {
        // 　校验
        check(this.userId, String);
        check(postAttributes, {
            title: String,
            url: String
        });
        console.log("校验完毕");
        if (Meteor.isServer) {
            postAttributes.title += '(server)'
            //  用于测试延迟补偿
            // Meteor._sleepForMs(5000)
        } else {
            // ．　　客户端也会模拟运行这段代码　　展示结果　　如果服务端来的结果来的话　　会覆盖本地的数据
            postAttributes.title += '(client)'
        }
        var errors = checkPost(postAttributes)
        if (errors.url || errors.title) {
            //  这种情况一般出现在　　　在页面的控制台上　发送消息　
            throw new Meteor.Error('invalid post', ' ＝＝＝＝＝＝＝＝＝＝＝')
        }
        // 　是否有相同文章
        var postWithSameLink = Posts.findOne({
            url: postAttributes.url
        });
        if (postWithSameLink) {
            return {
                postExists: true,
                _id: postWithSameLink._id
            }
        }
        console.log("没有相同的文章");

        // 　添加文章
        var user = Meteor.user();
        var post = _.extend(postAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date(),
            commentsCount: 0,
            upvoters: [],
            votes: 0
        });

        var postId = Posts.insert(post);



        console.log("添加成功");
        console.log(post);
        return {
            _id: postId
        };
    },
    //  更新投票
    upvote: function(postId) {
        check(this.userId, String);

        check(postId, String);

        // post = Posts.findOne(postId);
        // if (!post) {
        //     throw new Meteor.Error("未找到帖子")
        // }
        //
        // if (_.include(post.upvoters, this.userId)) {
        //     throw new Meteor.Error("已经投过票了")
        // }

        //  查询　　更新　　一步到位
        　
        var affected = Posts.update({
            _id: postId,
            upvoters: {
                $ne: this.userId
            }
        }, {
            $addToSet: {
                upvoters: this.userId
            },
            $inc: {
                votes: 1
            }
        });
        if (!affected) {
            throw new Meteor.Error('invalid', '投票失败')
        }


    }
});
// 检查数据
checkPost = function(post) {
    var errors = {};

    if (!post.title)
        errors.title = "Please fill in a headline";

    if (!post.url)
        errors.url = "Please fill in a URL";

    return errors;
}
