const EN = 'postSubmitErrors'

Template.postSubmit.helpers({
    errorMessage: function(field) {　　 //　　错误信息
        return Session.get(EN)[field]
    },
    errorClass: function(field) { // 样式使用的
        return !!Session.get(EN)[field] ? 'has-error' : ''
    }
});
// 初始化　　这个变量
Template.postSubmit.onCreated(function() {
    Session.set(EN, {});
});

Template.postSubmit.events({
    'submit form': function(e) {
        e.preventDefault();
        var post = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        };
        var errors = checkPost(post)
        if (errors.url || errors.title) {
            return Session.set(EN, errors);
        }


        // 调用服务器的方法　来添加文章
        Meteor.call("insertInner", post, function(error, result) {
            if (error) {
                return throwError(err.reason)
            }
            if (result.postExists) {
                throwError('文章已经存在')
            }
            Router.go('postPage', {
                _id: result._id
            });
        });
        // Router.go('postsList');
    }
});
