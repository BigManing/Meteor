
Template.postItem.helpers({
    domain: function() {
        var a = document.createElement('a')
        a.href = this.url
        return a.hostname

    },
    ownPost: function() {
        return this.userId === Meteor.userId();
    },
    //  ｃｓｓ　　样式的控制
    upvotedClass: function() {
        var userId = Meteor.userId()
        if (userId && !_.include(this.upvoters, userId)) {
            return 'btn-primary upvotable';
        } else {
            return 'disabled';
        }
    }
});
Template.postItem.events({
    "click .upvote": function(event, template) {
        event.preventDefault();
        Meteor.call("upvote", this._id);
    }
});
