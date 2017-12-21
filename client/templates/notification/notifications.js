Template.notifications.helpers({
    notificationCount: function() {
        return Notifications.find({
            userId: Meteor.userId(),
            read: false
        }).count()
    },
    notifications: function() {
        return Notifications.find({
            userId: Meteor.userId(),
            read: false
        });
    }
});
Template.notificationItem.helpers({
    notificationPostPath: function() {
        // console.log(this);
        return Router.routes.postPage.path({
            _id: this.postId
        })
    }
});
// 　更新　　是否已阅读　　　为　ｔｒｕｅ　
Template.notificationItem.events({
    "click  a": function(event, template) {
        console.log(this);
        Notifications.update(this._id, {
            $set: {
                read: true
            }
        })
    }
});
