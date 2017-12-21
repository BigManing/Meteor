Template.registerHelper("convert", function(count, name) {
    return count > 1 ? count + name + 's' : count + name
});

