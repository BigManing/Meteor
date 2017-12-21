Template.postEdit.events({
    // 　提交　　修改数据　　　　  $set　　只修改指定的　　字段
    "submit  form": function(event, template) {
        //  防止多次点击　　　　ｉｄ　　　　ｐｏｓｔ　　　　ｕｐｄａｔｅ
        event.preventDefault()
        var post = {
            url: $(event.target).find('[name=url]').val(),
            title: $(event.target).find('[name=title]').val()
        }
        var currentId = this._id
        Posts.update({
            _id: currentId
        }, 　 {　　　　　　
            $set: post　　　　　　　　　　
        }, function(err) {　
            console.log(this);
            if (err) {
                throwError(err.reason)
            }　
            else {
                Router.go('postPage', {
                    _id: currentId
                })
            }
        });
    },
    //  删除对象　
    "click  .delete": function(event, template) {　　
        Posts.remove(this._id, function(err) {　
            if (err) {
                throwError(err.reason)
            }　
            else {
                Router.go('home')
            }
        });　　　
    }
});
