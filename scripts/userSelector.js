var UserSelectorModel = Backbone.DeepModel.extend({
    defaults: {
        "selectedId": 0,
        "selectedName": '',
        "minCharsToSearch": 2,
        "maxHeight": '200px',
        "maxWidth": '220px'
    }
});

var UserSelector = Backbone.View.extend({
    className: 'form-inline',
    events: {
        'keyup input.form-control': 'showSearchResults',
        'focusout input.form-control': 'hideSearchResults',
        'click .userSearchResults>div': 'selectSearchResult',
        'mouseover .userSearchResults': 'mouseOverSearchResult',
        'mouseover .userSearchResults>div': 'mouseOverSearchResultItem',
        'mouseout .userSearchResults': 'mouseOutSearchResult',
        'click button.openSelector': 'showDepartmentsTree',
        'click button.clearSelection': 'clearSelection'
    },
    initialize: function () {
        if (this.collection != undefined) {
            var users = [];
            _.each(this.collection.pluck('Value'),
                function (item) {
                    mergeByProperty(users, item, 'Id');
                });
            this.model.set('users', users);
        }


        var editable = this.model.get('editable');
        if (editable == undefined)
        {
            this.model.set('editable',true);
        }

        if(this.el!=undefined)
        {
            var selectedId = this.model.get('selectedId');
            if (selectedId == undefined) {
                selectedId = 0;
                this.model.set('selectedId', 0);
            }
            if (selectedId != undefined)
            {
                this.model.set('selectedName', getValue(this.findById(selectedId),'Name'));
            }
            this.render();
        }
    },
    getId: function (undefIfZero) {
        var result = this.model.get('selectedId');
        if (undefIfZero && result == 0) {
            result = undefined;
        }
        return result;
    },
    getName: function()
    {
        return this.model.get('selectedName');
    },
    getDepartment: function () {
        var id = this.model.get('selectedId');
        var result = undefined;
        if(!id)
        {
            return result;
        }
        
        _.each(this.collection.toJSON(),
            function (department) {
                if (result == undefined)
                {
                    var user = _.findWhere(department.Value, { Id: id });
                    if (user) {
                        result = {
                            DepartmentID: department.Id,
                            DepartmentName: department.Name
                        }
                    }
                }
                
            });
        
        return result;
    
    },
    clearSelection: function () {
        this.setSelected(0, '');
    },
    showDepartmentsTree: function () {
        var that = this;
        $("<div />", { id: 'orderContainer' }).html(render("departmentTree", { collection: this.collection.toJSON(), selectedId: this.model.get('selectedId') })
            ).dialog({
                height: 600,
                width:300,
                resizable: false,
                modal: true,
                draggable: false,
                title: 'Employee selection',
                open: function () {
                    var dialog = this;
                    $(this).find("#tree").fancytree({
                        autoCollapse: true,
                        selectMode: 1,
                        checkbox: false,
                        icons: false,
                        clickFolderMode: 2,
                        dblclick: function (event, data) {
                            console.log(data);
                            if (data.node.folder) {
                                return false;
                            }
                            that.setSelected(data.node.key.split('_')[1], data.node.title);
                            $(dialog).dialog('close');
                        }
                    });
                },
                close: function (event, ui) {
                    $(this).dialog('destroy').remove()
                }
            });
    },
    mouseOutSearchResult: function (e) {
        this.mouseOverSearchResults = false;
    },
    mouseOverSearchResult: function (e) {
        this.mouseOverSearchResults = true;
    },
    mouseOverSearchResultItem: function (e) {
        $(e.currentTarget).parent().children(".hovered").removeClass("hovered");
        $(e.currentTarget).addClass("hovered");
        //debugger;
    },
    setById: function(id)
    {
        var user = this.findById(id);
        if(user)
        {
            this.setSelected(id, user.Name);
        }
    },
    setSelected: function (id, name) {
        id = parseInt(id);
        this.$(".form-control, .selectedNameOld").val(name);
        this.$(".selectedIdOld").val(id);
        this.model.set({
            selectedId: id,
            selectedName: name
        });
    },
    selectSearchResult: function (e) {
        this.setSelected($(e.currentTarget).attr('userId'), $(e.currentTarget).html());
        this.mouseOverSearchResults = false;
        this.hideSearchResults(undefined,false);
    },
    showSearchResults: function (e) {
        if (e.keyCode == 13) {
            var element = $(".userSearchResults .hovered");
            if (element.length == 1) {
                this.setSelected(element.attr('userId'), element.html());
                this.mouseOverSearchResults = false;
                this.hideSearchResults(undefined, false);
            }
            return;
        }
        if (e.keyCode == 27)
        {
            this.mouseOverSearchResults = false;
            this.hideSearchResults(undefined, true);
            return;
        }
        if (e.keyCode == 38 || e.keyCode == 40)
        {
            if($(".userSearchResults").length == 1)
            {
                var currentIndex = $(".userSearchResults .hovered").index();
                var count = $(".userSearchResults>div").length;
                if (count == 0)
                {
                    return;
                }
                $(".userSearchResults>div").removeClass("hovered");
                if(currentIndex == -1)
                {
                    currentIndex = 0;
                }
                else {
                    if(e.keyCode == 40)
                    {
                        currentIndex++;
                        if (currentIndex == count) {
                            currentIndex = 0
                        }
                    }
                    else if(e.keyCode == 38)
                    {
                        currentIndex--;
                        if(currentIndex == -1)
                        {
                            currentIndex = count - 1;
                        }
                    }
                }
                $(".userSearchResults>div:nth-child("+(currentIndex+1)+")").addClass("hovered");
            }

            return;
        }
        var value = $(e.currentTarget).val();
        var minCharsToSearch = this.model.get('minCharsToSearch');
        if(value.length >= minCharsToSearch)
        {
            
            var mathedUsers = _(this.model.get('users')).filter(function (item) { return item.Name.toLowerCase().indexOf(value.toLowerCase()) != -1; });
            $(".userSearchResults").remove();
            var resultsContainer = undefined;
            if (mathedUsers != undefined && mathedUsers.length > 0)
            {
                mathedUsers = _(mathedUsers).sortBy('Name');
                resultsContainer = ($("<div />", {
                    class: 'userSearchResults',
                    css: {
                        'max-width': this.model.get('maxWidth'),
                        'max-height': this.model.get('maxHeight')
                    }
                }));
                _(mathedUsers).each(function (item) {
                    resultsContainer.append($("<div />", {
                        text: item.Name,
                        userId: item.Id
                        }));
                });
                
            }
            else {
                resultsContainer = ($("<div />", {
                    class: 'userSearchResults',
                    text: "No results"
                }));
            }
            this.$el.append(resultsContainer);
        }
    },
    hideSearchResults: function (event, undo) {
        if (undo == undefined) {
            undo = true;
        }

        if (!this.mouseOverSearchResults)
        {
            $(".userSearchResults").remove();
        }
        else {
            this.$(".form-control").focus();
        }
        if (undo) {
            this.$(".form-control").val(this.$(".selectedNameOld").val());
        }
        
    },
    findById: function(id)
    {
        var users = this.model.get('users');
        if (users == undefined) {
            return '';
        }

        return _(users).findWhere({ Id: id });

    },

    render: function () {
        var result = render(this.templateName, { model: this.model.toJSON() });
        this.$el.html(
            result
            );
    },
    templateName: 'userSelector',
    mouseOverSearchResults: false
});