const NAME = 'commentSubmitErrors'
Template.commentSubmit.onCreated(function() {
    Session.set(NAME, {});
});
Template.commentSubmit.helpers({
    errorClass: function(field) {
        return !!Session.get(NAME)[field] ? 'has-error' : ''
    },
    errorMessage: function(field) {
        return Session.get(NAME)[field]
    }
});


Template.commentSubmit.events({
    "submit form": function(e, template) { // 提交评论
        e.preventDefault()
        var target = $(e.target).find('[name=body]')
        // check(content, String);
        // 　检查　是否为空　
        if (!target.val()) {
            return Session.set(NAME, {
                body: '请输入评论，再提交'
            })
        }

            // 　插入帖子
        var comment = {
                body: target.val(),
                postId: template.data._id
            };
        Meteor.call("commentInsert", comment, function(error, result) {
            if (error) {
                throwError(error.reason)
            } else {
                target.val('') // 输入框　　恢复原位
            }
        });

    }
});
