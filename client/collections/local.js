Errors = new Mongo.Collection(null);
//  添加错误到　　本地数据库中
throwError = function(message) {
    Errors.insert({
        message: message
    });
}
