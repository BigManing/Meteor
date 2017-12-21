import {
    check
} from 'meteor/check';
//  评论　
Notifications = new Mongo.Collection("notifications");
//  只允许修改一个字段的属性
Notifications.allow({
    update: function(userId, post, fieldNames) {
        return ownDocument(userId, post) &&
            fieldNames.length === 1 && fieldNames[0] === 'read'
    }
});
 creatNotification = function(comment) {
    var post = Posts.findOne(comment.postId)
    if (post.userId !== Meteor.userId()) { // 排除本人的帖子
        //  帖子　　用户　　评论　　ｉｄ　　　　　　评论的作者
        Notifications.insert({
            userId: post.userId,
            postId: post._id,
            commentId: comment._id,
            commenterName: comment.author,
            read: false,
        });
    }
}