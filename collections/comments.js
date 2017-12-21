import {
    check
} from 'meteor/check';
//  评论　
Comments = new Mongo.Collection("comments");
//
// Collection.allow({
//     insert: function() {
//         return !Meteor.userId(); // 用户得登录才行
//     },
//     // update: function(){
//     //   return true;
//     // },
//     // remove: function(){
//     //   return true;
//     // }
// });

Meteor.methods({
    commentInsert: function(comment) {
        check(this.userId, String);
        check(comment, {
            body: String,
            postId: String
        });
        var user = Meteor.user();
        var post = Posts.findOne(comment.postId)

        if (!post) {
            throw new Meteor.Error('评论必须发布到帖子上')
        }

        comment.userId = user._id
        comment.author = user.username
        comment.submitted = new Date()


        console.log(comment);
        comment._id = Comments.insert(comment)
        //  回帖数量＋１
        Posts.update(comment.postId, {
            $inc: {
                commentsCount: 1
            }
        });
        // 添加了；评论　　　需要更新　　ｎｏｔｉｆｉｃａｔｉｏｎ　
        creatNotification(comment)

        return comment._id;
    }
});
