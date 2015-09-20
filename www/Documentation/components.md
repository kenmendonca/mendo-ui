#Components
##Atoms
An atom is the lowest level of a component, it cannot depend on any other components. The current atomic components are the **textAtom**, **inputAtom**, **plaintextAtom**, **textareaAtom**, **selectAtom**, **radioAtom**, **checkboxAtom**, **checkboxListAtom**, **buttonAtom**, **dropdownAtom**, and the **paginationAtom**.

The **textAtom**, **inputAtom**, **textareaAtom**, **selectAtom**, **radioAtom**, **checkboxAtom**, and **checkboxListAtom** are not available to developers as components, instead higher order components which provide this functionality will extend these atomic components and should be used.
###PlaintextAtom
The **plaintextAtom** is used for providing textual content that has no formatting or additional functionality. Every component which has a place with text will include the plaintextAtom as a default.
[](component:plaintextAtom)
###ButtonAtom
The **buttonAtom** is used for providing buttons that have some sort of [click action](#ClickAction).
[](component:buttonAtom)
###DropdownAtom
The **dropdownAtom** is a component that is like a button, yet it has a dropdown. The dropdown menu can either have a *link* (with a [click action](#ClickAction)), a *seperator*, or a *header*.
[](component:dropdownAtom)
###PaginationAtom
The **paginationAtom** is used for providing pagination. It is tied to a model which has two attributes: **currentPage** and **numberPages** which refer to the current page and total number of pages, respectively. 
[](component:paginationAtom)

The following atoms are used as parts of other components.
###TextAtom
The **textAtom** functions as a formattable text component; it can either be unstyled or be *bold*, *italics*, *underline*, *strikethrough*, *small*, or it can have a **custom class**. The **textAtom** can also be *text*, a *link* (with a [click action](#ClickAction)), or *html*. 
[](component:textAtom)
###InputAtom
The **inputAtom** is an input which is **type** *text*, *password*, or *email*. It comes with a **model** which is saved into the [dataService](#ModelData), and a **name**, which is used in [form validation](#FormData). The **inputAtom** can have a mask, in which `9` represents any digit and `A` represents any letter. For example, if I wanted a mask for (123)-456-7890, I could use `(999)-999-9999` as the **mask** and `(___)-___-____` as the **maskPlaceholder**. The **maskModel** attribute represents whether the model should have the markup or not. The predefined **validators** available are: *required*, *pattern*, *minlength*, and *maxlength*.
[](component:inputAtom)
###Date
The **date** is not technically an atom, but it extends off the **inputAtom**. It has a **mask** for `--/--/----`, and has two predefined **validators**: *date* and *dateCompare*. The *date* validator checks whether the date is valid, for example `13/14/2012` is an invalid date. The *dateCompare* is used for any date comparisons against absolute dates, relative dates, etc. TODO the options.
[](component:date)
###TextareaAtom
The **textareaAtom** represents a textarea, and can have a **name**, **model**, as well as a customized number of **rows** and a **mask**. The predefined **validators** available are the same as those available by the **inputAtom**. 
[](component:textareaAtom)
###SelectAtom
The **selectAtom** represents a select dropdown, which also has a **name** and a **model**. There is a **default** option that has no value, which will cause a *required* validator to evaluate as `false` if selected. The other options can be enumerated in the **questions** array. The only predefined **validator** is **required**.
[](component:selectAtom) 
###RadioAtom
The **radioAtom** represents a radio button, without a label, or just the input itself. It has a **model**, and **name**, as well as a **value**. The only predefined **validator** is **required**.
[](component:radioAtom)
###CheckboxAtom
The **checkboxAtom** represents a checkbox, without a label, or just the input itself. It has a **model**, and **name**. There are no predefined **validators**, the only one available is **custom**.
[](component:checkboxAtom)
###CheckboxListAtom
The **checkboxListAtom** represents a checkbox, without a label, or just the input itself. It has a **model**, and **name**, but in addition to a **checkboxAtom** it has a **value** and a **groupModel**. This is because in addition to the **model** for a checkbox being `true` or `false` depending on whether it is checked or not, the **groupModel** is an array of all the checkboxes that are checked, identified by **value**. The predefined **validators** available are *minChecked* and *maxChecked*.
[](component:checkboxListAtom)
##Form
###FormGroup
The **formGroup** is available to the developer as a wrapper for **inputAtom**, **date**, **textareaAtom**, or **selectAtom**. It can have a **label** and **helpText**, and it is through this component that the error styling is added. Notice how the **formComponent.formComponent** JSON is an **inputAtom** and that the **hasLabel.label** JSON is a **plaintextAtom**.
[](component:formGroup)
###RadioGroup
The **radioGroup** is available to the developer as a wrapper for a group of **radioAtom**s. It can have a **label** and it is through this component that the error styling is added. The components can also be displayed *inline* or *block*, depending on the layout.
[](component:radioGroup)
###CheckboxGroup
The **checkboxGroup** is available to the developer as a wrapper for a group of **checkboxAtom**s or **checkboxListAtoms**s. It can have a **label** and it is through this component that the error styling is added. The components can also be displayed *inline* or *block*, depending on the layout.
[](component:checkboxGroup)
##Scaffolding
There are two scaffolding components available: the **componentScaffold** and **subView**.
###ComponentScaffold
Sometimes, it is necessary to have scaffolding within **the Scaffold Editor**. Suppose, for instance, we want to put anything we want into an **acordion** component, but we want to be able to layout it in a certain way. This is why the **body** of the **accordion** has a **componentScaffold**. If we wanted two **formGroup**s side-by-side,  the JSON for the **componentScaffold** would look like so:
[](component:componentScaffold)
###SubView
The **subView** is used to denote where nested routes would appear, it has no configuration.
##Text
Most text components are the **inline** component with extra markup.
###Tooltip
A **textAtom** with a tooltip.
[](component:tooltip)
###Inline
An array of **textAtom**s, **plaintextAtom**s, and **tooltip**s.
[](component:inline)
###Paragraph
An **inline** wrapped in a paragraph tag with customizable **alignment**. 
[](component:paragraph)
###Heading
An **inline** wrapped in an h1-h6 heading tag.
[](component:heading)
###List
An either *unordered* or *ordered* list. List styling is optional through **hasListStyle**, which removes the indent and the bullet/number and a sub list is possible through **subList**.
[](component:list)
###Table
A table with text-based **tableHeaders** and **tableRows**.
[](component:table)
##Complex Components
###SortTable
A table to display data in which each column is sortable. Pagination and searching is available through the **paginationModel** and **searchModel** and how many items per page are given by **perPageModel**. Given this sample data:

	$scope.data.sortTableData = [{
		name: 'Bob',
		age: 12
	}, 
	{
		name: 'Ken',
		age: 22
	}, 
	{
		name: 'Jim',
		age: 90
	}, 
	{
		name: 'John',
		age: 13
	}, 
	{
		name: 'Bill',
		age: 31
	}];

The **sortTable** would look like this:
[](component:sortTable)
###Accordion
The **accordion** is a collapsible accordion component, in which the content is a **componentScaffold**.
[](component:accordion)
###Media Object
The **mediaObject** can either be an *orderedList* or can be a list of *images* and can either be *vertical* or *horizontal*.
[](component:mediaObject)
##Error Messages
###ErrorMessages
Error messages are shown by the *errorMessages** component, which is given the **name** of the component it is an error message for, as well as a list of **validator** conditions and messages.
[](component:errorMessages)
[JSON]
{
    "plaintextAtom": {
        "type": "plaintextAtom",
        "identifier": "j6yh5xtnw",
        "content": "plaintext",
        "shown": "show"
    },
    "textAtom": {
        "type": "textAtom",
        "identifier": "x2u8djlkadsgc84g",
        "style": "default",
        "class": "",
        "textType": "link",
        "clickAction": "anchor",
        "href": "#",
        "validateForm": false,
        "compile": false,
        "content": "textAtom type link",
        "shown": "show"
    },
    "buttonAtom": {
        "class": "default",
        "clickAction": "anchor",
        "content": "buttonAtom",
        "disabled": false,
        "href": "#",
        "identifier": "nnj43pc8bsw40g88",
        "shown": "show",
        "sizing": "md",
        "type": "buttonAtom",
        "validateForm": false
    },
    "dropdownAtom": {
        "type": "dropdownAtom",
        "identifier": "e6856xsq7",
        "title": "dropdownAtom",
        "caret": true,
        "class": "default",
        "sizing": "md",
        "direction": "down",
        "disabled": false,
        "dropdownMenu": [
            {
                "menuItemType": "link",
                "content": "dropdownAtom link",
                "state": "default",
                "clickAction": "anchor",
                "href": "#",
                "validateForm": false,
                "clickFnName": ""
            },
            {
                "menuItemType": "seperator"
            },
            {
                "menuItemType": "header",
                "content": "dropdownAtom header"
            }
        ],
        "shown": "show"
    },
    "paginationAtom": {
        "type": "paginationAtom",
        "identifier": "mz6c381p0b4cc0ck",
        "model": "paginationAtomModel",
        "maxWidth": 4,
        "shown": "show"
    },
    "inputAtom": {
        "type": "inputAtom",
        "identifier": "mh7z2r6yt68ow4s0",
        "id": "inputAtom",
        "model": "inputAtom",
        "name": "inputAtom",
        "inputType": "text",
        "readonly": false,
        "disabled": false,
        "placeholder": "inputAtom",
        "sizing": "medium",
        "hasMask": {
            "hasMask": false
        },
        "validators": [],
        "utilities": [],
        "shown": "show"
    },
    "textareaAtom": {
        "type": "textareaAtom",
        "identifier": "jmnrj2xib7s44www",
        "id": "textareaAtom",
        "model": "textareaAtom",
        "name": "textareaAtom",
        "rows": 3,
        "readonly": false,
        "disabled": false,
        "placeholder": "textareaAtom",
        "hasMask": {
            "hasMask": false
        },
        "validators": [],
        "utilities": [],
        "shown": "show"
    },
    "selectAtom": {
        "type": "selectAtom",
        "identifier": "m240u6pihj4448k8",
        "id": "selectAtom",
        "model": "selectAtom",
        "name": "selectAtom",
        "readonly": false,
        "disabled": false,
        "sizing": "medium",
        "default": {
            "label": "selectAtom default option"
        },
        "questions": [
            {
                "label": "selectAtom option 1",
                "value": "option1"
            },
            {
                "label": "selectAtom option 2",
                "value": "option2"
            }
        ],
        "validators": [],
        "shown": "show"
    },
    "radioAtom": {
        "type": "radioAtom",
        "identifier": "asdflk23roisdf",
        "id": "radioAtom",
        "model": "radioAtomModel",
        "name": "radioAtom",
        "value": "radioAtom",
        "disabled": false,
        "validators": [],
        "shown": "show"
    },
    "checkboxAtom": {
        "type": "checkboxAtom",
        "identifier": "093rj09fsdfe",
        "id": "checkboxAtom",
        "model": "checkboxAtom",
        "name": "checkboxAtom",
        "disabled": false,
        "validators": [],
        "shown": "show"
    },
    "checkboxListAtom": {
        "type": "checkboxListAtom",
        "identifier": "kfioe89ewfl",
        "id": "checkboxListAtom",
        "model": "checkboxListAtom",
        "groupModel": "checkboxListAtomGroupModel",
        "name": "checkboxListAtom",
        "value": "checkboxListAtom1",
        "disabled": false,
        "validators": [],
        "shown": "show"
    },
    "date": {
        "type": "date",
        "identifier": "kjaosion3rfds",
        "id": "date",
        "model": "date",
        "name": "date",
        "readonly": false,
        "disabled": false,
        "placeholder": "MM/DD/YYYY",
        "maskModel": true,
        "sizing": "medium",
        "validators": [],
        "shown": "show"
    },
    "formGroup": {
        "type": "formGroup",
        "identifier": "jiofdsoijhs98",
        "hasLabel": {
            "hasLabel": true,
            "formComponentId": "formGroup",
            "label": {
                "type": "plaintextAtom",
                "identifier": "gxo9h0e15swkocsg",
                "content": "formGroup",
                "shown": "show"
            }
        },
        "formComponent": {
            "primitive": "inputAtom",
            "formComponent": {
                "type": "inputAtom",
                "identifier": "fdlkmsf98",
                "id": "formGroup",
                "model": "formGroup",
                "name": "formGroup",
                "inputType": "text",
                "readonly": false,
                "disabled": false,
                "placeholder": "formGroup",
                "sizing": "medium",
                "hasMask": {
                    "hasMask": false
                },
                "validators": [
                    {
                        "condition": "required",
                        "parameter": ""
                    }
                ],
                "utilities": [],
                "shown": "show"
            }
        },
        "hasHelpText": {
            "hasHelpText": true,
            "helpText": {
                "type": "paragraph",
                "identifier": "klaldsfkljadsf8",
                "alignment": "left",
                "parentClass": "",
                "class": "",
                "contents": [
                    {
                        "type": "plaintextAtom",
                        "identifier": "faskjljfad8",
                        "content": "formGroup help text",
                        "shown": "show"
                    }
                ],
                "shown": "show"
            }
        },
        "shown": "show"
    },
    "radioGroup": {
        "type": "radioGroup",
        "identifier": "e4x1d2lk1nccs804",
        "layout": "block",
        "radioComponents": [
            {
                "hasLabel": {
                    "hasLabel": true,
                    "label": {
                        "type": "plaintextAtom",
                        "identifier": "lzyf4u6qx4wwgw4s",
                        "content": "radioGroup button 1 block",
                        "shown": "show"
                    }
                },
                "radioComponent": {
                    "type": "radioAtom",
                    "identifier": "g49ynfyn1vk0cgwg",
                    "id": "radioGroupButton1",
                    "model": "radioGroup",
                    "name": "radioGroup",
                    "value": "radioGroupButton1",
                    "disabled": false,
                    "validators": [],
                    "shown": "show"
                }
            },
            {
                "hasLabel": {
                    "hasLabel": true,
                    "label": {
                        "type": "plaintextAtom",
                        "identifier": "htnrida3huwo4wkg",
                        "content": "radioGroup button 2 block",
                        "shown": "show"
                    }
                },
                "radioComponent": {
                    "type": "radioAtom",
                    "identifier": "ebgjonr84vcos44c",
                    "id": "radioGroupButton2",
                    "model": "radioGroup",
                    "name": "radioGroup",
                    "value": "radioGroupButton2",
                    "disabled": false,
                    "validators": [],
                    "shown": "show"
                }
            }
        ],
        "shown": "show"
    },
    "checkboxGroup": {
        "type": "checkboxGroup",
        "identifier": "lccvf0qvyts8480c",
        "layout": "block",
        "checkboxComponents": [
            {
                "hasLabel": {
                    "hasLabel": true,
                    "label": {
                        "type": "plaintextAtom",
                        "identifier": "ftxaj276w8gsc8sg",
                        "content": "checkboxGroup button 1 block",
                        "shown": "show"
                    }
                },
                "checkboxComponent": {
                    "primitive": "checkboxAtom",
                    "checkboxComponent": {
                        "type": "checkboxAtom",
                        "identifier": "hmg4ybsawiwo44kw",
                        "id": "",
                        "model": "checkboxAtomModel1",
                        "name": "",
                        "disabled": false,
                        "validators": [],
                        "shown": "show"
                    }
                }
            },
            {
                "hasLabel": {
                    "hasLabel": true,
                    "label": {
                        "type": "plaintextAtom",
                        "identifier": "fi0uhsl2exkcgkoc",
                        "content": "checkboxGroup button 2 block",
                        "shown": "show"
                    }
                },
                "checkboxComponent": {
                    "primitive": "checkboxAtom",
                    "checkboxComponent": {
                        "type": "checkboxAtom",
                        "identifier": "jyq3d4yovggw8wko",
                        "id": "",
                        "model": "checkboxAtomModel2",
                        "name": "",
                        "disabled": false,
                        "validators": [],
                        "shown": "show"
                    }
                }
            }
        ],
        "shown": "show"
    },
    "componentScaffold": {
        "type": "componentScaffold",
        "identifier": "",
        "row": [
            [
                {
                    "width": 6,
                    "scaffoldComponents": [
                        {
                            "type": "formGroup",
                            "identifier": "oaczdxy3ipq840g0c",
                            "hasLabel": {
                                "hasLabel": true,
                                "formComponentId": "firstName",
                                "label": {
                                    "type": "plaintextAtom",
                                    "identifier": "gxo9h0ex15swkocsg",
                                    "content": "First name",
                                    "shown": "show"
                                }
                            },
                            "formComponent": {
                                "primitive": "inputAtom",
                                "formComponent": {
                                    "type": "inputAtom",
                                    "identifier": "kbvo3cn52ka0o4sw4",
                                    "id": "firstName",
                                    "model": "firstName",
                                    "name": "firstName",
                                    "inputType": "text",
                                    "readonly": false,
                                    "disabled": false,
                                    "placeholder": "",
                                    "sizing": "medium",
                                    "hasMask": {
                                        "hasMask": false
                                    },
                                    "validators": [
                                        {
                                            "condition": "required",
                                            "parameter": ""
                                        }
                                    ],
                                    "utilities": [],
                                    "shown": "show"
                                }
                            },
                            "hasHelpText": {
                                "hasHelpText": false
                            },
                            "shown": "show"
                        }
                    ],
                    "subComponentScaffold": {
                        "hasSubComponentScaffold": false
                    }
                },
                {
                    "width": 6,
                    "scaffoldComponents": [
                        {
                            "type": "formGroup",
                            "identifier": "oaczxy3ipqsdf840g0c",
                            "hasLabel": {
                                "hasLabel": true,
                                "formComponentId": "lastName",
                                "label": {
                                    "type": "plaintextAtom",
                                    "identifier": "gxo9h0ehdf15swkocsg",
                                    "content": "Last name",
                                    "shown": "show"
                                }
                            },
                            "formComponent": {
                                "primitive": "inputAtom",
                                "formComponent": {
                                    "type": "inputAtom",
                                    "identifier": "kbvo3cn52k0o4sfsw4",
                                    "id": "lastName",
                                    "model": "lastName",
                                    "name": "lastName",
                                    "inputType": "text",
                                    "readonly": false,
                                    "disabled": false,
                                    "placeholder": "",
                                    "sizing": "medium",
                                    "hasMask": {
                                        "hasMask": false
                                    },
                                    "validators": [
                                        {
                                            "condition": "required",
                                            "parameter": ""
                                        }
                                    ],
                                    "utilities": [],
                                    "shown": "show"
                                }
                            },
                            "hasHelpText": {
                                "hasHelpText": false
                            },
                            "shown": "show"
                        }
                    ],
                    "subComponentScaffold": {
                        "hasSubComponentScaffold": false
                    }
                }
            ]
        ],
        "shown": "show"
    },
    "tooltip": {
        "type": "tooltip",
        "identifier": "cl5wzdqdfgd6dwdf4oss",
        "tooltipContent": "tooltipContent",
        "placement": "top",
        "contents": {
            "type": "plaintextAtom",
            "identifier": "md3df0qiwdgdfedwwsc",
            "content": "tooltip text",
            "shown": "show"
        },
        "shown": "show"
    },
    "inline": {
        "type": "inline",
        "identifier": "lfyvchujqn4qn4g4gaw",
        "contents": [
            {
                "type": "plaintextAtom",
                "identifier": "fjx5a0invfga0wk8",
                "content": "plaintextAtom inline ",
                "shown": "show"
            },
            {
                "type": "textAtom",
                "identifier": "x2u8dlkac84321g",
                "style": "default",
                "class": "",
                "textType": "link",
                "clickAction": "anchor",
                "href": "#",
                "validateForm": false,
                "compile": false,
                "content": "textAtom link inline",
                "shown": "show"
            }
        ],
        "shown": "show"
    },
    "paragraph": {
        "type": "paragraph",
        "identifier": "",
        "alignment": "right",
        "parentClass": "",
        "class": "",
        "contents": [
            {
                "type": "plaintextAtom",
                "identifier": "a0inasflvfga0wk8",
                "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, ",
                "shown": "show"
            },
            {
                "type": "textAtom",
                "identifier": "x2u8dlkac8432lds81g",
                "style": "default",
                "class": "",
                "textType": "link",
                "clickAction": "anchor",
                "href": "#",
                "validateForm": false,
                "compile": false,
                "content": "when an unknown printer ",
                "shown": "show"
            },
            {
                "type": "plaintextAtom",
                "identifier": "a0inasflvo8fga0wk8",
                "content": "took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                "shown": "show"
            }
        ],
        "shown": "show"
    },
    "heading": {
        "type": "heading",
        "identifier": "khe39vu1lwesskw",
        "parentClass": "",
        "class": "",
        "sizing": "h3",
        "contents": {
            "type": "plaintextAtom",
            "identifier": "lro939rhi9cosog4",
            "content": "Level 3 heading",
            "shown": "show"
        },
        "shown": "show"
    },
    "list": {
        "type": "list",
        "identifier": "g3ena1y7t68ko68k",
        "listType": "ordered",
        "hasListStyle": true,
        "listItems": [
            {
                "contents": {
                    "type": "plaintextAtom",
                    "identifier": "fogntbr3dwskkwsk",
                    "content": "ordered list item 1",
                    "shown": "show"
                },
                "subList": {
                    "hasSubList": false
                }
            },
            {
                "contents": {
                    "type": "plaintextAtom",
                    "identifier": "kj6pfdgcouk4ouk4",
                    "content": "ordered list item 2",
                    "shown": "show"
                },
                "subList": {
                    "hasSubList": true,
                    "list": {
                        "type": "list",
                        "identifier": "dfep3zrm4nscwnsc",
                        "listType": "unordered",
                        "hasListStyle": true,
                        "listItems": [
                            {
                                "contents": {
                                    "type": "plaintextAtom",
                                    "identifier": "eois27qrq5wow5wo",
                                    "content": "unordered list item 2.1",
                                    "shown": "show"
                                },
                                "subList": {
                                    "hasSubList": true,
                                    "list": {
                                        "type": "list",
                                        "identifier": "olc38nrw70ws80ws",
                                        "listType": "unordered",
                                        "hasListStyle": false,
                                        "listItems": [
                                            {
                                                "contents": {
                                                    "type": "plaintextAtom",
                                                    "identifier": "e34xeepb0p04kp04",
                                                    "content": "unstyled unordered list item 2.1.1",
                                                    "shown": "show"
                                                },
                                                "subList": {
                                                    "hasSubList": false
                                                }
                                            }
                                        ],
                                        "shown": "show"
                                    }
                                }
                            },
                            {
                                "contents": {
                                    "type": "plaintextAtom",
                                    "identifier": "oy0fo45gn20cg20c",
                                    "content": "unordered list item 2.2",
                                    "shown": "show"
                                },
                                "subList": {
                                    "hasSubList": false
                                }
                            }
                        ],
                        "shown": "show"
                    }
                }
            }
        ],
        "shown": "show"
    },
    "table": {
        "type": "table",
        "identifier": "nmaor1861frk4kkw",
        "class": "",
        "tableHeaders": [
            {
                "contents": {
                    "type": "plaintextAtom",
                    "identifier": "h9igl1w2j4wk4cs8",
                    "content": "table header 1",
                    "shown": "show"
                }
            },
            {
                "contents": {
                    "type": "plaintextAtom",
                    "identifier": "ks0hjdfvpo0gw488",
                    "content": "table header 2",
                    "shown": "show"
                }
            }
        ],
        "tableRows": [
            [
                {
                    "contents": {
                        "type": "plaintextAtom",
                        "identifier": "lmdribs91lkccscs",
                        "content": "column 1 row 1",
                        "shown": "show"
                    }
                },
                {
                    "contents": {
                        "type": "plaintextAtom",
                        "identifier": "chwyt2j3vi80ck8o",
                        "content": "column 2 row 1",
                        "shown": "show"
                    }
                }
            ],
            [
                {
                    "contents": {
                        "type": "plaintextAtom",
                        "identifier": "lmdrisz1lkccscs",
                        "content": "column 1 row 2",
                        "shown": "show"
                    }
                },
                {
                    "contents": {
                        "type": "plaintextAtom",
                        "identifier": "chwyt2j3vi80sz8o",
                        "content": "column 2 row 2",
                        "shown": "show"
                    }
                }
            ]
        ],
        "shown": "show"
    },
    "sortTable": {
        "type": "sortTable",
        "model": "sortTableData",
        "searchModel": "searchModel",
        "perPageModel": "perPageModel",
        "paginationModel": "paginationModel",
        "identifier": "i1xu7gpca884kw8s",
        "class": "",
        "columns": [
            {
                "key": "name",
                "tableHeader": {
                    "contents": {
                        "type": "plaintextAtom",
                        "identifier": "jj7tq00935kws4o0",
                        "content": "Name",
                        "shown": "show"
                    },
                    "sortable": true
                },
                "tableData": {
                    "contents": {
                        "type": "plaintextAtom",
                        "identifier": "eut9khfy1swk09kcs",
                        "content": "REPLACE",
                        "shown": "show"
                    }
                }
            },
            {
                "key": "age",
                "tableHeader": {
                    "contents": {
                        "type": "plaintextAtom",
                        "identifier": "jj709q0kd35kws4o0",
                        "content": "Age",
                        "shown": "show"
                    },
                    "sortable": true
                },
                "tableData": {
                    "contents": {
                        "type": "plaintextAtom",
                        "identifier": "eut9khfy1sw09kcs",
                        "content": "REPLACE",
                        "shown": "show"
                    }
                }
            }
        ],
        "shown": "show"
    },
    "accordion": {
        "type": "accordion",
        "identifier": "hatrgeic2ncogkwg",
        "panels": [
            {
                "class": "default",
                "id": "",
                "heading": {
                    "contents": {
                        "type": "inline",
                        "identifier": "lfyvchujqn4g4sgw",
                        "contents": [
                            {
                                "type": "plaintextAtom",
                                "identifier": "fjx5a0invfkk0wk8",
                                "content": "accordion title",
                                "shown": "show"
                            }
                        ],
                        "shown": "show"
                    }
                },
                "body": {
                    "contents": {
                        "type": "componentScaffold",
                        "identifier": "i0hnh2tod6w40g8g",
                        "row": [
                            [
                                {
                                    "width": 12,
                                    "scaffoldComponents": [
                                        {
                                            "type": "plaintextAtom",
                                            "identifier": "k8sdbx5ps4gg4cco",
                                            "content": "Accordion content",
                                            "shown": "show"
                                        }
                                    ],
                                    "subComponentScaffold": {
                                        "hasSubComponentScaffold": false
                                    }
                                }
                            ]
                        ],
                        "shown": "show"
                    }
                }
            }
        ],
        "shown": "show"
    },
    "mediaObject": {
        "type": "mediaObject",
        "identifier": "i2tyh77g7io8c8w4",
        "layout": "horizontal",
        "shown": "show",
        "contents": {
            "mediaObjType": "orderedList",
            "contentsArray": [
                {
                    "heading": {
                        "type": "heading",
                        "identifier": "khe39vu1nloksskw",
                        "parentClass": "",
                        "class": "",
                        "sizing": "h4",
                        "contents": {
                            "type": "plaintextAtom",
                            "identifier": "lro939rhi9cosog4",
                            "content": "mediaObject orderedList horizontal",
                            "shown": "show"
                        },
                        "shown": "show"
                    },
                    "text": {
                        "type": "plaintextAtom",
                        "identifier": "gqhq28qs67ks0osw",
                        "content": "content content content content",
                        "shown": "show"
                    }
                },
                {
                    "heading": {
                        "type": "heading",
                        "identifier": "m53c5nw0j5cs4wcs",
                        "parentClass": "",
                        "class": "",
                        "sizing": "h4",
                        "contents": {
                            "type": "plaintextAtom",
                            "identifier": "goj2020q880kc0g0",
                            "content": "mediaObject orderedList horizontal",
                            "shown": "show"
                        },
                        "shown": "show"
                    },
                    "text": {
                        "type": "plaintextAtom",
                        "identifier": "fyapq7yq7aos8w8s",
                        "content": "content content content content",
                        "shown": "show"
                    }
                }
            ]
        }
    },
    "errorMessages": {
        "type": "errorMessages",
        "identifier": "o6y0wonfxlskkwo4",
        "name": "formComponentName",
        "multiple": false,
        "style": "box",
        "validators": [
            {
                "condition": "required",
                "contents": {
                    "type": "plaintextAtom",
                    "identifier": "d092ob3yes8csokc",
                    "content": "This field is required.",
                    "shown": "show"
                }
            }
        ],
        "shown": "show"
    }
}
[/JSON]