Template.errors.helpers({

    errors: function() {　　 //　　返回数据
        return Errors.find();
    }
});

Template.errors.events({
    "click #foo": function(event, template) {

    }
});
Template.errors.onRendered = function() {
    console.log('ｃａｃｌｅ  cache');
    var error = this.data
    Match.setTimeout(function() {
        console.log('ｃａｃｌｅ  cache');
        Errors.remove(error._id)
    }, 3000);
}
