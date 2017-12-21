Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() {
        return [Meteor.subscribe('notifications')];
    }
});
//   路径－－－－－》　映射到指定的魔板名称
// 首页
PostsListController = RouteController.extend({
    template: 'postsList',
    increment: 5,
    postsLimite: function() {
        return parseInt(this.params.postsLimite) || 5
    },
    postOption: function() {
        return {
            sort: this.sort,
            limit: this.postsLimite()
        }
    },
    subscriptions: function() {
        this.postSub = Meteor.subscribe('posts', this.postOption())
    },
    posts: function() {
        return Posts.find({}, this.postOption())
    },
    data: function() {
        var hasMore = this.posts().count() === this.postsLimite()
        return {
            posts: this.posts(),
            ready: this.postSub.ready,
            nextPath: hasMore ? this.nextPath() : null
        };
    },
});


NewPostController = PostsListController.extend({
    sort: {
        submitted: -1,
        _id: -1
    },
    nextPath: function() {
        return Router.routes.newPost.path({
            postsLimite: this.postsLimite() + this.increment
        });
    }
});
BestPostController = PostsListController.extend({
    sort: {
        votes: -1,
        commentsCount: -1,
        submitted: -1,
    },
    nextPath: function() {
        return Router.routes.bestPost.path({
            postsLimite: this.postsLimite() + this.increment
        });
    }
});

Router.route('/', {
    name: 'home',
    controller: NewPostController
});

Router.route('/new/:postsLimite?', {
    name: 'newPost',
});
Router.route('/best/:postsLimite?', {
    name: 'bestPost',
});






// 　帖子　详情
Router.route('/posts/:_id', {
    name: 'postPage',
    waitOn: function() {
        return [Meteor.subscribe('singlePost', this.params._id),
            Meteor.subscribe('comments', this.params._id)
        ]
    },
    data: function() {
        // console.log(params);
        return Posts.findOne(this.params._id);

    },
});

// 　帖子  　编辑  ( 通过上下文　吧　　ｉｄ传递进来)
Router.route('/posts/:_id/edit', {
    name: 'postEdit',
    waitOn: function() {
        return Meteor.subscribe('singlePost', this.params._id)
    },
    data: function() {
        return Posts.findOne(this.params._id);
    }
});

// 　去找　　ｐｏｓｔｓｕｂｍｉｔ　这个模板　　　显示的是　　　／ｓｕｂｍｉｔ　　这个连接
Router.route('/submit', {
    name: 'postSubmit',

});

// 数据没找到
Router.onBeforeAction('dataNotFound', {
    only: 'postPage'
});
// 检查登录
Router.onBeforeAction(function() {
    if (!Meteor.user()) {　
        if (Meteor.loggingIn()) {　
            this.render(this.loadingTemplate)　
        } else {　
            this.render("accessDenied")　
        }
    } else {
        this.next()
    }
}, {
    only: 'postSubmit'
});
