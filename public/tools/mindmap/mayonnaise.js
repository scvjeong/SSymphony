var preventDefault = function () {
    this.returnValue = false
}, preventTouch = function () {
        return this.originalEvent.preventDefault()
    }, stopPropagation = function () {
        this.cancelBubble = true
    }, stopTouch = function () {
        return this.originalEvent.stopPropagation()
    }, addEvent = (function () {
        if (document.addEventListener) {
            return function (h, d, c, b) {
                var a = supportsTouch && touchMap[d] ? touchMap[d] : d;
                var g = function (m) {
                    if (supportsTouch && touchMap.hasOwnProperty(d)) {
                        for (var k = 0, l = m.targetTouches && m.targetTouches.length; k < l; k++) {
                            if (m.targetTouches[k].target == h) {
                                var f = m;
                                m = m.targetTouches[k];
                                m.originalEvent = f;
                                m.preventDefault = preventTouch;
                                m.stopPropagation = stopTouch;
                                break
                            }
                        }
                    }
                    return c.call(b, m)
                };
                h.addEventListener(a, g, false);
                return function () {
                    h.removeEventListener(a, g, false);
                    return true
                }
            }
        } else {
            if (document.attachEvent) {
                return function (h, d, c, b) {
                    var g = function (f) {
                        f = f || win.event;
                        f.preventDefault = f.preventDefault || preventDefault;
                        f.stopPropagation = f.stopPropagation || stopPropagation;
                        return c.call(b, f)
                    };
                    h.attachEvent("on" + d, g);
                    var a = function () {
                        h.detachEvent("on" + d, g);
                        return true
                    };
                    return a
                }
            }
        }
    })();

function F_CheckKey(a, b) {
    a = (a) ? a : window.event;
    code = (a.keyCode) ? a.keyCode : a.charCode;
    for (var c = 0; c < b.length; c++) {
        if (b[c] == code) {
            return true
        }
    }
    return false
}
JinoController = function (c) {
    this.map = c;
    this.nodeEditor = null;
    document.onkeydown = function (d) {
        d = d || window.event;
        if (jMap.work.hasFocus()) {
            return false
        }
        return true
    };
    this.setNodeEditor(c.nodeEditorHandle[0]);
    this.map.mousemove(this.mousemove);
    this.map.mousedown(this.mousedown);
    this.map.mouseup(this.mouseup);
    this.map.work.onkeydown = this.keyDown;
    this.map.work.ondragenter = function (d) {
        d = d || window.event;
        if (d.preventDefault) {
            d.preventDefault()
        } else {
            d.returnValue = false
        }
    };
    this.map.work.ondragover = function (d) {
        d = d || window.event;
        if (d.preventDefault) {
            d.preventDefault()
        } else {
            d.returnValue = false
        }
    };
    this.map.work.ondrop = function (d) {
        d = d || window.event;
        if (d.preventDefault) {
            d.preventDefault()
        } else {
            d.returnValue = false
        }
    };

    function b(d) {
        if (d < 0) {
            if (jMap.scaleTimes < 0.2) {
                return
            }
            jMap.scale(jMap.scaleTimes - 0.1)
        } else {
            if (jMap.scaleTimes > 2.5) {
                return
            }
            jMap.scale(jMap.scaleTimes + 0.1)
        }
    }
    function a(d) {
        var f = 0;
        if (!d) {
            d = window.event
        }
        if (d.wheelDelta) {
            f = d.wheelDelta / 120;
            if (window.opera) {
                f = -f
            }
        } else {
            if (d.detail) {
                f = -d.detail / 3
            }
        } if (f) {
            b(f)
        }
        if (d.preventDefault) {
            d.preventDefault()
        }
        d.returnValue = false
    }
    if (window.addEventListener) {
        window.addEventListener("DOMMouseScroll", a, false)
    }
    window.onmousewheel = document.onmousewheel = a
};
JinoController.prototype.type = "JinoController";
JinoController.prototype.keyDown = function (l) {
    if (STAT_NODEEDIT) {
        return true
    }
    l = l || window.event;
    var a = null;
    if (l) {
        a = l.ctrlKey
    } else {
        if (l && document.getElementById) {
            a = (Event.META_MASK || Event.CTRL_MASK)
        } else {
            if (l && document.layers) {
                a = (l.metaKey || l.ctrlKey)
            }
        }
    }
    var h = l.altKey;
    var b = l.keyCode;
	console.log(b);
    switch (b) {
    case 35:
        if (h) {
            jMap.controller.unfoldingAllAction()
        }
        break;
    case 36:
        if (h) {
            jMap.controller.foldingAllAction()
        }
        break;
    case 37:
        if (a) {
            ScaleAnimate.prevShow(30);
            return false
        }
        var f = jMap.getSelecteds().getLastElement();
        switch (jMap.layoutManager.type) {
        case "jMindMapLayout":
            if (f.isRootNode()) {
                var c = f.getChildren();
                for (var g = 0; g < c.length; g++) {
                    if (c[g].position == "left") {
                        c[g].focus(true);
                        break
                    }
                }
            } else {
                if (f.isLeft()) {
                    jMap.controller.childNodeFocusAction(f)
                } else {
                    jMap.controller.parentNodeFocusAction(f)
                }
            }
            break;
        case "jTreeLayout":
            jMap.controller.prevSiblingNodeFocusAction(f);
            break;
        default:
        }
        break;
    case 38:
        if (a) {
            ScaleAnimate.tempRotate(jMap.getSelecteds().getLastElement());
            return false
        }
        var f = jMap.getSelecteds().getLastElement();
        switch (jMap.layoutManager.type) {
        case "jMindMapLayout":
            if (f.isRootNode()) {} else {
                jMap.controller.prevSiblingNodeFocusAction(f)
            }
            break;
        case "jTreeLayout":
            jMap.controller.parentNodeFocusAction(f);
            break;
        default:
        }
        break;
    case 39:
        if (a) {
            ScaleAnimate.nextShow(30);
            return false
        }
        var f = jMap.getSelecteds().getLastElement();
        switch (jMap.layoutManager.type) {
        case "jMindMapLayout":
            if (f.isRootNode()) {
                var c = f.getChildren();
                for (var g = 0; g < c.length; g++) {
                    if (c[g].position == "right") {
                        c[g].focus(true);
                        break
                    }
                }
            } else {
                if (f.isLeft()) {
                    jMap.controller.parentNodeFocusAction(f)
                } else {
                    jMap.controller.childNodeFocusAction(f)
                }
            }
            break;
        case "jTreeLayout":
            jMap.controller.nextSiblingNodefocusAction(f);
            break;
        default:
        }
        break;
    case 40:
        var f = jMap.getSelecteds().getLastElement();
        switch (jMap.layoutManager.type) {
        case "jMindMapLayout":
            if (f.isRootNode()) {} else {
                jMap.controller.nextSiblingNodefocusAction(f)
            }
            break;
        case "jTreeLayout":
            jMap.controller.childNodeFocusAction(f);
            break;
        default:
        }
        break;
    case 49:
        if (a) {
            NodeColorMix(jMap.rootNode)
        }
        break;
    case 50:
        if (a) {
            var d = function (r, q, m) {
                var p = r.body.getBBox().width;
                if (!q[m]) {
                    q[m] = 0
                }
                q[m] = (p > q[m]) ? p : q[m];
                if (r.getChildren().length > 0) {
                    var o = r.getChildren();
                    m++;
                    for (var n = 0; n < o.length; n++) {
                        d(o[n], q, m)
                    }
                }
            };
            var k = [];
            d(jMap.getRootNode(), k, 0);
            console.log(k)
        }
        break;
    case 51:
        if (a) {}
        break;
    case 52:
        if (a) {}
        break;
    case 53:
        if (a) {
            console.log(DeliciousService.session())
        }
        break;
    case 54:
        if (a) {
            jMap.cfg.realtimeSave = false;
            DeliciousService.init(jMap)
        }
        break;
    case 55:
        if (a) {
            DeliciousService.logout()
        }
        break;
    case 65:
        if (a) {
            alert(jMap.getSelected().id)
        }
        break;
    case 67:
        if (a) {
            jMap.controller.copyAction()
        }
        break;
    case 70:
        if (a) {
            jMap.controller.findNodeAction()
        }
        break;
    case 71:
        if (a) {
            if (AL_GOOGLE_SEARCHER == null) {
                SET_GOOGLE_SEARCHER(true)
            } else {
                SET_GOOGLE_SEARCHER(false)
            }
        } else {
            if (l.shiftKey) {} else {}
        }
        break;
    case 75:
        if (a) {
            jMap.controller.insertHyperAction()
        }
        if (h) {
            jMap.controller.insertImageAction()
        }
        break;
    case 77:
        break;
    case 78:
        if (a) {
            location.href = "/mindmap/new.do"
        }
        break;
    case 79:
        if (a) {
            openMap()
        }
        break;
    case 80:
        if (a) {
            if (ScaleAnimate.isShowMode()) {
                ScaleAnimate.endShowMode()
            } else {
                ScaleAnimate.startShowMode(30, 20, true)
            }
        }
        break;
    case 81:
        if (a) {
            window.open("/viewqueue.do?page=" + location.pathname)
        }
        break;
    case 83:
        if (a) {
            if (!jMap.isSaved()) {
                saveMap()
            }
        } else {
            if (l.shiftKey) {} else {}
        }
        break;
    case 88:
        if (a) {
            jMap.controller.cutAction()
        }
        break;
    case 86:
        if (a) {
            jMap.controller.pasteAction()
        }
        break;
    case 89:
        if (a) {
            jMap.controller.redoAction()
        }
        break;
    case 90:
        if (a) {
            jMap.controller.undoAction()
        }
        break;
    case 113:
        jMap.controller.editNodeAction();
        break;
    case 13:
        jMap.controller.insertSiblingAction();
        break;
    case 27:
        if (a) {} else {
            if (l.shiftKey) {} else {}
        }
        break;
    case 32:
        jMap.controller.foldingAction();
        break;
    case 8:
    case 46:
        jMap.controller.deleteAction();
        break;
    case 9:
    case 45:
        jMap.controller.insertAction();
        break;
    case 107:
        jMap.scale(jMap.scaleTimes + 0.1);
        break;
    case 109:
        jMap.scale(jMap.scaleTimes - 0.1);
        break
    }
    return false
};
JinoController.prototype.mousemove = function (d) {
    var c;
    if (!d) {
        var d = window.event
    }
    if (d.target) {
        c = d.target
    } else {
        if (d.srcElement) {
            c = d.srcElement
        }
    } if (c.nodeType == 3) {
        c = c.parentNode
    }
    if (c.id == "nodeEditor") {
        return true
    }
    if (jMap.DragPaper && jMap._enableDragPaper) {
        var b = d.clientX - DRAG_POS.x;
        var a = d.clientY - DRAG_POS.y;
        DRAG_POS.x = d.clientX;
        DRAG_POS.y = d.clientY;
        this.work.scrollTop -= a;
        this.work.scrollLeft -= b
    }
    return false
};
JinoController.prototype.MoveWithChildNode = function (d, b, a) {
    d.translate(b, a);
    for (var c = d.children.length; c--;) {
        MoveWithChildNode(d.children[c], b, a)
    }
};
JinoController.prototype.mousedown = function (b) {
    var a;
    if (!b) {
        var b = window.event
    }
    if (b.target) {
        a = b.target
    } else {
        if (b.srcElement) {
            a = b.srcElement
        }
    } if (a.nodeType == 3) {
        a = a.parentNode
    }
    if (a.id == "nodeEditor") {
        return true
    }
    if (STAT_NODEEDIT) {
        jMap.controller.stopNodeEdit(true)
    }
    if (a.id == "paper_mapview") {
        DRAG_POS.x = b.clientX;
        DRAG_POS.y = b.clientY;
        jMap.DragPaper = true;
        jMap.controller.blurAll()
    } else {
        if (a.id == "jinomap") {
            if (a.offsetLeft <= b.clientX && b.clientX < a.clientWidth + a.offsetLeft && a.offsetTop <= b.clientY && b.clientY < a.clientHeight + a.offsetTop) {
                DRAG_POS.x = b.clientX;
                DRAG_POS.y = b.clientY;
                jMap.DragPaper = true
            }
            jMap.controller.blurAll()
        }
    }
};
JinoController.prototype.mouseup = function (a) {
    a = a || window.event;
    jMap.DragPaper = false;
    jMap.positionChangeNodes = false
};
JinoController.prototype.nodeEditKeyDown = function (b) {
    b = b || window.event;
    if (F_CheckKey(b, [27])) {
        if (J_NODE_CREATING) {
            var c = null;
            var a = null;
            while (c = jMap.getSelecteds().pop()) {
                a = c.getParent();
                c.remove()
            }
            J_NODE_CREATING.focus(true);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(a);
            jMap.layoutManager.layout(true)
        }
        jMap.controller.stopNodeEdit(false)
    } else {
        if (F_CheckKey(b, [13])) {
            if (BrowserDetect.browser == "Firefox" && jMap.keyEnterHit++ == 0) {
                return false
            }
            if (b.shiftKey) {
                var d = jMap.controller.nodeEditor;
                d.style.height = d.offsetHeight + 9 + "px";
                return true
            }
            jMap.controller.stopNodeEdit(true);
            return false
        }
    }
    return true
};
JinoController.prototype.setNodeEditor = function (a) {
    this.nodeEditor = a;
    if (this.nodeEditor) {
        this.nodeEditor.style.display = "none";
        this.nodeEditor.onkeypress = this.nodeEditKeyDown
    }
};
JinoController.prototype.startNodeEdit = function (d) {
    if (this.nodeEditor == undefined || this.nodeEditor == null || d.removed) {
        return false
    }
    var h = TEXT_HGAP;
    var a = TEXT_VGAP;
    if (STAT_NODEEDIT) {
        this.stopNodeEdit(true)
    }
    STAT_NODEEDIT = true;
    this.nodeEditor.setAttribute("nodeID", d.id);
    var f = this.nodeEditor;
    var m = [];
    m.x = 0;
    m.y = 0;
    m.width = RAPHAEL.getSize().width;
    m.height = RAPHAEL.getSize().height;
    if (RAPHAEL.canvas.getAttribute("viewBox")) {
        var g = RAPHAEL.canvas.getAttribute("viewBox").split(" ");
        m.x = g[0];
        m.y = g[1];
        m.width = g[2];
        m.height = g[3]
    }
    f.style.fontFamily = d.text.attr()["font-family"];
    f.style.fontSize = d.text.attr()["font-size"] * this.map.cfg.scale + "px";
    if (d.isLeft()) {
        f.style.textAlign = "right"
    } else {
        f.style.textAlign = "left"
    }
    var b = d.body.getBBox().width * this.map.cfg.scale - h;
    var l = d.body.getBBox().height * this.map.cfg.scale - a;
    var c = (d.body.getBBox().x - m.x) * RAPHAEL.getSize().width / m.width + h / 4;
    var k = (d.body.getBBox().y - m.y) * RAPHAEL.getSize().height / m.height + a / 4;
    f.style.display = "";
    f.style.width = b + "px";
    f.style.height = l + a + "px";
    f.style.left = c + "px";
    f.style.top = k - a / 4 + "px";
    f.style.zIndex = 999;
    f.style.isleft = d.isLeft();
    f.value = d.getText();
    f.focus();
    return true
};
JinoController.prototype.stopNodeEdit = function (a) {
    STAT_NODEEDIT = false;
    J_NODE_CREATING = false;
    jMap.work.focus();
    if (this.nodeEditor == undefined || this.nodeEditor == null) {
        return null
    }
    if (a == false) {
        this.nodeEditor.style.display = "none";
        return null
    }
    var c = this.nodeEditor.getAttribute("nodeID");
    if (c == undefined || c == null || c == "") {
        this.nodeEditor.style.display = "none";
        return null
    }
    var b = this.map.getNodeById(c);
    if (b == undefined || b == null) {
        this.nodeEditor.style.display = "none";
        return null
    }
    this.nodeEditor.style.display = "none";
    this.nodeEditor.setAttribute("nodeID", "");
    var f = this.nodeEditor;
    var d = JinoUtil.trimStr(f.value);
    if (d == b.getText()) {
        return null
    }
    b.setText(d);
    
    console.log(this.nodeEditor);
    console.log(d);
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(b);
    jMap.layoutManager.layout(true);
    return b
};
JinoController.prototype.blurAll = function () {
    var b = jMap.getSelecteds();
    for (var a = b.length - 1; a >= 0; a--) {
        b[a].blur()
    }
};
JinoController.prototype.copyAction = function () {
    jMap.clipboardManager.toClipboard(jMap.getSelecteds(), true)
};
JinoController.prototype.cutAction = function (c) {
    if (!c) {
        c = jMap.getSelecteds()
    }
    jMap.clipboardManager.toClipboard(c);
    for (var b = 0; b < c.length; b++) {
        c[b].remove()
    }
    var a = c[0].parent;
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(a);
    jMap.layoutManager.layout(true);
    return a
};
JinoController.prototype.pasteAction = function (g) {
    if (!g) {
        g = jMap.getSelected()
    }
    g.folded && g.setFolding(false);
    var h = jMap.loadManager.pasteNode(g, jMap.clipboardManager.getClipboardText());
    for (var f = 0; f < h.length; f++) {
        jMap.saveAction.pasteAction(h[f])
    }
    if (jMap.cfg.lazyLoading) {
        for (var f = 0; f < h.length; f++) {
            var d = h[f].getChildren();
            for (var k = d.length - 1; k >= 0; k--) {
                d[k].removeExecute()
            }
        }
    }
    var a = "<clipboard>";
    for (var f = 0; f < h.length; f++) {
        var b = h[f].toXML();
        a += b
    }
    a += "</clipboard>";
    jMap.fireActionListener(ACTIONS.ACTION_NODE_PASTE, g, a);
    jMap.initFolding(g);
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(g);
    jMap.layoutManager.layout(true)
};
JinoController.prototype.deleteAction = function () {
    var b = null;
    var a = null;
    var c = -1;
    while (b = jMap.getSelecteds().pop()) {
        a = b.getParent();
        c = b.getIndexPos();
        b.remove()
    }
    if (a) {
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(a);
        jMap.layoutManager.layout(true)
    }
    if (c != -1) {
        if (a.getChildren().length <= 0) {
            a.focus()
        } else {
            if (a.getChildren().length > c) {
                a.getChildren()[c].focus()
            } else {
                a.getChildren()[a.getChildren().length - 1].focus()
            }
        }
    }
};
JinoController.prototype.editNodeAction = function () {
    jMap.getSelecteds().getLastElement() && jMap.controller.startNodeEdit(jMap.getSelecteds().getLastElement())
};
JinoController.prototype.insertAction = function () {
    var b = jMap.getSelecteds().getLastElement();
    if (b) {
        J_NODE_CREATING = b;
        b.folded && b.setFolding(false);
        var a = jMap.createNodeWithCtrl(b);
        a.focus(true);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(b);
        jMap.layoutManager.layout(true);
        a.setTextExecute("");
        jMap.controller.startNodeEdit(a)
    }
};
JinoController.prototype.insertSiblingAction = function () {
    if (BrowserDetect.browser == "Firefox") {
        jMap.keyEnterHit = 0
    }
    var f = jMap.getSelecteds().getLastElement();
    var d = f && f.parent;
    if (d) {
        J_NODE_CREATING = f;
        var b = f.getIndexPos() + 1;
        var a = null;
        if (f.position && f.getParent().isRootNode()) {
            a = f.position
        }
        var c = jMap.createNodeWithCtrl(d, null, null, b, a);
        c.focus(true);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(c);
        jMap.layoutManager.layout(true);
        c.setTextExecute("");
        jMap.controller.startNodeEdit(c)
    }
};
JinoController.prototype.insertHyperAction = function () {
    var f = jMap.getSelecteds().getLastElement();
    var c = f.hyperlink && f.hyperlink.attr().href;
    c = c || "http://";
    var a = '<center>Insert HyperLink</center><br />URL:<br /><input type="text" id="jino_input_url"name="jino_input_url" value=' + c + " />";

    function b(h, g, k) {
        if (h) {
            f.setHyperlink(k.jino_input_url);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(f);
            jMap.layoutManager.layout(true)
        }
        jMap.work.focus()
    }
    var d = $.prompt(a, {
        callback: b,
        persistent: false,
        focusTarget: "jino_input_url",
        top: "30%",
        buttons: {
            Ok: true
        }
    })
};
JinoController.prototype.insertImageAction = function () {
    var d = jMap.getSelecteds().getLastElement();
    var b = d.img && d.img.attr().src;
    b = b || "http://";
    var a = '<center>Insert Image</center><br />URL:<br /><input type="text" id="jino_input_img_url"name="jino_input_img_url" value=' + b + " />";

    function f(h, g, k) {
        if (h) {
            d.setImage(k.jino_input_img_url);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(d);
            jMap.layoutManager.layout(true)
        }
        jMap.work.focus()
    }
    var c = $.prompt(a, {
        callback: f,
        persistent: false,
        focusTarget: "jino_input_img_url",
        top: "30%",
        buttons: {
            Ok: true
        }
    })
};
JinoController.prototype.findNodeAction = function () {
    var a = 'Find : <input type="text" id="jino_input_search_text"name="jino_input_search_text" value="" /><br /><br /><input type="checkbox" id="jino_check_search_ignorecase"name="jino_check_search_ignorecase" value="" checked>ignorecase<input type="checkbox" id="jino_check_search_wholeword"name="jino_check_search_wholeword" value="">wholeword';

    function b(p, k, o) {
        if (p) {
            var q = o.jino_input_search_text;
            var r = o.jino_check_search_ignorecase;
            var n = o.jino_check_search_wholeword;
            var d = jMap.findNode(q, n, r, jMap.getSelecteds().getLastElement());
            for (var l = 0; l < d.length; l++) {
                var h = d[l].node;
                var g = h;
                while (!g.isRootNode()) {
                    g = g.getParent();
                    g.folded && g.setFoldingExecute(false)
                }
                h.focus(false)
            }
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
            jMap.layoutManager.layout(true)
        }
        jMap.work.focus()
    }
    var c = $.prompt(a, {
        callback: b,
        persistent: false,
        focusTarget: "jino_input_search_text",
        top: "30%",
        buttons: {
            Find: true
        }
    })
};
JinoController.prototype.foldingAction = function (a) {
    if (!a) {
        a = jMap.getSelecteds().getLastElement()
    }
    a.setFolding(!a.folded);
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(a);
    jMap.layoutManager.layout(true)
};
JinoController.prototype.foldingAllAction = function () {
    var a = jMap.getSelecteds().getLastElement();
    a.setFoldingAll(true);
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
    jMap.layoutManager.layout(true)
};
JinoController.prototype.unfoldingAllAction = function () {
    var a = jMap.getSelecteds().getLastElement();
    a.setFoldingAll(false);
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
    jMap.layoutManager.layout(true)
};
JinoController.prototype.parentNodeFocusAction = function (a) {
    a.getParent().focus(true)
};
JinoController.prototype.childNodeFocusAction = function (b) {
    if (b.folded) {
        b.setFolding(false);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(b);
        jMap.layoutManager.layout(true);
        return false
    }
    var a = b.getChildren();
    if (a.length > 0) {
        a[0].focus(true)
    }
};
JinoController.prototype.prevSiblingNodeFocusAction = function (c) {
    var b = c.prevSibling(true);
    if (b) {
        var a = b.getParent();
        if (a.folded) {
            a.setFolding(false);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(a);
            jMap.layoutManager.layout(true)
        }
        b.focus(true)
    }
};
JinoController.prototype.nextSiblingNodefocusAction = function (c) {
    var b = c.nextSibling(true);
    if (b) {
        var a = b.getParent();
        if (a.folded) {
            a.setFolding(false);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(a);
            jMap.layoutManager.layout(true)
        }
        b.focus(true)
    }
};
JinoController.prototype.nodeStructureFromText = function (c) {
    if (!c) {
        c = jMap.getSelecteds().getLastElement()
    }
    var a = '다음 텍스트를 노드로 생성합니다.<br/><center><textarea id="okm_node_structure_textarea" name="okm_node_structure_textarea" onkeydown="return $.prompt.interceptTabs(event, this);" cols="65" rows="10"></textarea></center>';

    function d(h, g, l) {
        if (h) {
            var k = l.okm_node_structure_textarea;
            c.folded && c.setFoldingExecute(false);
            jMap.createNodeFromText(c, k);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(c);
            jMap.layoutManager.layout(true)
        }
        jMap.work.focus()
    }
    var b = $.prompt(a, {
        callback: d,
        persistent: false,
        focusTarget: "okm_node_structure_textarea",
        top: "30%",
        enterToOk: false,
        buttons: {
            Insert: true
        }
    })
};
JinoController.prototype.nodeStructureToText = function (c) {
    if (!c) {
        c = jMap.getSelecteds().getLastElement()
    }
    var d = jMap.createTextFromNode(c, "\t");
    var a = '다음은 노드의 구조입니다.<br/><center><textarea id="okm_node_structure_textarea" name="okm_node_structure_textarea" onkeydown="return $.prompt.interceptTabs(event, this);" cols="65" rows="10">' + d + "</textarea></center>";
    var b = $.prompt(a, {
        persistent: false,
        focusTarget: "okm_node_structure_textarea",
        top: "30%",
        buttons: {
            Close: true
        }
    })
};
JinoController.prototype.nodeStructureFromXml = function (c) {
    if (!c) {
        c = jMap.getSelecteds().getLastElement()
    }
    var a = '다음 XML을 노드로 생성합니다.<br/><center><textarea id="okm_node_structure_textarea" name="okm_node_structure_textarea" onkeydown="return $.prompt.interceptTabs(event, this);" cols="65" rows="10"></textarea></center>';

    function d(h, g, l) {
        if (h) {
            var n = l.okm_node_structure_textarea;
            var o = jMap.loadManager.pasteNode(c, n);
            for (var k = 0; k < o.length; k++) {
                jMap.saveAction.pasteAction(o[k])
            }
            jMap.fireActionListener(ACTIONS.ACTION_NODE_PASTE, c, n);
            jMap.initFolding(c);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(c);
            jMap.layoutManager.layout(true)
        }
        jMap.work.focus()
    }
    var b = $.prompt(a, {
        callback: d,
        persistent: false,
        focusTarget: "okm_node_structure_textarea",
        top: "30%",
        enterToOk: false,
        buttons: {
            Insert: true
        }
    })
};
JinoController.prototype.nodeStructureToXml = function (c) {
    if (!c) {
        c = jMap.getSelecteds().getLastElement()
    }
    var d = "<okm>" + c.toXML() + "</okm>";
    var a = '다음은 노드의 구조입니다.<br/><center><textarea id="okm_node_structure_textarea" name="okm_node_structure_textarea" onkeydown="return $.prompt.interceptTabs(event, this);" cols="65" rows="10">' + d + "</textarea></center>";
    var b = $.prompt(a, {
        persistent: false,
        focusTarget: "okm_node_structure_textarea",
        selectText: "okm_node_structure_textarea",
        top: "30%",
        buttons: {
            Close: true
        }
    })
};
JinoController.prototype.nodeTextColorAction = function (d) {
    if (!d) {
        d = jMap.getSelecteds().getLastElement()
    }
    var a = '<center>Text Color</center><br /><div style="height:130px;"><input type="text" style="width:220px;" class="color" id="jino_input_textcolor"name="jino_input_textcolor" /></div><script type="text/javascript">var myPicker = new jscolor.color(document.getElementById("jino_input_textcolor"), {});myPicker.hash = true;myPicker.pickerFaceColor = "transparent";myPicker.pickerFace = 5;myPicker.pickerBorder = 0;myPicker.pickerInsetColor = "black";myPicker.fromString("' + d.getTextColor() + '");<\/script>';

    function c(h, g, k) {
        if (h) {
            d.setTextColor(k.jino_input_textcolor)
        }
        jMap.work.focus()
    }
    var b = $.prompt(a, {
        callback: c,
        persistent: true,
        focusTarget: "jino_input_textcolor",
        prefix: "jqicolor",
        top: "30%",
        buttons: {
            Ok: true
        }
    })
};
JinoController.prototype.nodeBackgroundColorAction = function (d) {
    if (!d) {
        d = jMap.getSelecteds().getLastElement()
    }
    var a = '<center>Background Color</center><br /><div style="height:130px;"><input type="text" style="width:220px;" class="color" id="jino_input_bgcolor"name="jino_input_bgcolor" /></div><script type="text/javascript">var myPicker = new jscolor.color(document.getElementById("jino_input_bgcolor"), {});myPicker.hash = true;myPicker.pickerFaceColor = "transparent";myPicker.pickerFace = 5;myPicker.pickerBorder = 0;myPicker.pickerInsetColor = "black";myPicker.fromString("' + d.getBackgroundColor() + '");<\/script>';

    function c(h, g, k) {
        if (h) {
            d.setBackgroundColor(k.jino_input_bgcolor)
        }
        jMap.work.focus()
    }
    var b = $.prompt(a, {
        callback: c,
        persistent: true,
        focusTarget: "jino_input_bgcolor",
        prefix: "jqicolor",
        top: "30%",
        buttons: {
            Ok: true
        }
    })
};
JinoController.prototype.deleteArrowlinkAction = function (b) {
    if (!b) {
        b = jMap.getSelecteds().getLastElement()
    }
    for (var a = 0; a < b.arrowlinks.length; a++) {
        b.removeArrowLink(b.arrowlinks[a])
    }
};
JinoController.prototype.screenFocusAction = function (a) {
    if (!a) {
        a = jMap.getSelecteds().getLastElement()
    }
    if (!a) {
        a = jMap.getRootNode()
    }
    a.screenFocus()
};
JinoController.prototype.undoAction = function () {
    jMap.historyManager && jMap.historyManager.undo()
};
JinoController.prototype.redoAction = function () {
    jMap.historyManager && jMap.historyManager.redo()
};
JinoControllerGuest = function (a) {
    this.map = a;
    this.nodeEditor = null;
    document.onkeydown = function (b) {
        b = b || window.event;
        if (jMap.work.hasFocus()) {
            return false
        }
        return true
    };
    this.map.mousemove(this.mouseMove);
    this.map.mousedown(this.mouseDown);
    this.map.mouseup(this.mouseUp);
    this.map.work.onkeydown = this.keyPress;
    this.map.work.ondragenter = function (b) {
        b = b || window.event;
        if (b.preventDefault) {
            b.preventDefault()
        } else {
            b.returnValue = false
        }
    };
    this.map.work.ondragover = function (b) {
        b = b || window.event;
        if (b.preventDefault) {
            b.preventDefault()
        } else {
            b.returnValue = false
        }
    };
    this.map.work.ondrop = function (b) {
        b = b || window.event;
        if (b.preventDefault) {
            b.preventDefault()
        } else {
            b.returnValue = false
        }
    }
};
JinoControllerGuest.prototype.type = "JinoControllerGuest";
JinoControllerGuest.prototype.keyPress = function (b) {
    if (STAT_NODEEDIT) {
        return true
    }
    b = b || window.event;
    var k = b.keyCode;
    switch (k) {
    case 37:
        var h = jMap.getSelecteds().getLastElement();
        if (h.isRootNode()) {
            var f = h.getChildren();
            for (var d = 0; d < f.length; d++) {
                if (f[d].position == "left") {
                    f[d].focus(true);
                    break
                }
            }
        } else {
            if (h.isLeft()) {
                if (h.folded) {
                    h.setFoldingExecute(false);
                    jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendants(h);
                    jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(h);
                    jMap.layoutManager.layout(true);
                    return false
                }
                var f = h.getChildren();
                if (f.length > 0) {
                    f[0].focus(true)
                }
            } else {
                h.getParent().focus(true)
            }
        }
        break;
    case 38:
        var h = jMap.getSelecteds().getLastElement();
        if (h.isRootNode()) {} else {
            var f = h.getParent().getChildren();
            if (h.getIndexPos() > 0) {
                f[h.getIndexPos() - 1].focus(true)
            }
        }
        break;
    case 39:
        var h = jMap.getSelecteds().getLastElement();
        if (h.isRootNode()) {
            var f = h.getChildren();
            for (var d = 0; d < f.length; d++) {
                if (f[d].position == "right") {
                    f[d].focus(true);
                    break
                }
            }
        } else {
            if (h.isLeft()) {
                h.getParent().focus(true)
            } else {
                if (h.folded) {
                    h.setFoldingExecute(false);
                    jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendants(h);
                    jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(h);
                    jMap.layoutManager.layout(true);
                    return false
                }
                var f = h.getChildren();
                if (f.length > 0) {
                    f[0].focus(true)
                }
            }
        }
        break;
    case 40:
        var h = jMap.getSelecteds().getLastElement();
        if (h.isRootNode()) {} else {
            var f = h.getParent().getChildren();
            if (f.length > h.getIndexPos() + 1) {
                f[h.getIndexPos() + 1].focus(true)
            }
        }
        break;
    case 70:
        if (b.ctrlKey) {
            var a = 'Find : <input type="text" id="jino_input_search_text"name="jino_input_search_text" value="" /><br /><br /><input type="checkbox" id="jino_check_search_ignorecase"name="jino_check_search_ignorecase" value="" checked>ignorecase<input type="checkbox" id="jino_check_search_wholeword"name="jino_check_search_wholeword" value="">wholeword';

            function c(t, p, s) {
                if (t) {
                    var u = s.jino_input_search_text;
                    var w = s.jino_check_search_ignorecase;
                    var r = s.jino_check_search_wholeword;
                    var l = jMap.findNode(u, r, w, jMap.getSelecteds().getLastElement());
                    for (var q = 0; q < l.length; q++) {
                        var o = l[q].node;
                        var n = o;
                        while (!n.isRootNode()) {
                            n = n.getParent();
                            n.folded && n.setFoldingExecute(false)
                        }
                        o.focus(false)
                    }
                    jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
                    jMap.layoutManager.layout(true)
                }
                jMap.work.focus()
            }
            var g = $.prompt(a, {
                callback: c,
                persistent: false,
                focusTarget: "jino_input_search_text",
                top: "30%",
                buttons: {
                    Find: true
                }
            })
        }
        break;
    case 71:
        if (b.ctrlKey) {
            if (AL_GOOGLE_SEARCHER == null) {
                SET_GOOGLE_SEARCHER(true)
            } else {
                SET_GOOGLE_SEARCHER(false)
            }
        } else {
            if (b.shiftKey) {} else {}
        }
        break;
    case 78:
        if (b.ctrlKey) {
            location.href = "/mindmap/new.do"
        }
        break;
    case 79:
        if (b.ctrlKey) {
            openMap()
        }
        break;
    case 32:
        var h = jMap.getSelecteds().getLastElement();
        h.setFoldingExecute(!h.folded);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendants(h);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(h);
        jMap.layoutManager.layout(true);
        break
    }
    return false
};
JinoControllerGuest.prototype.mouseMove = function (d) {
    var c;
    if (!d) {
        var d = window.event
    }
    if (d.target) {
        c = d.target
    } else {
        if (d.srcElement) {
            c = d.srcElement
        }
    } if (c.nodeType == 3) {
        c = c.parentNode
    }
    if (c.id == "nodeEditor") {
        return true
    }
    var b = d.clientX - DRAG_POS.x;
    var a = d.clientY - DRAG_POS.y;
    DRAG_POS.x = d.clientX;
    DRAG_POS.y = d.clientY;
    if (jMap.DragPaper) {
        this.work.scrollTop -= a;
        this.work.scrollLeft -= b
    }
    return false
};
JinoControllerGuest.prototype.mouseDown = function (b) {
    var a;
    if (!b) {
        var b = window.event
    }
    if (b.target) {
        a = b.target
    } else {
        if (b.srcElement) {
            a = b.srcElement
        }
    } if (a.nodeType == 3) {
        a = a.parentNode
    }
    if (a.id == "nodeEditor") {
        return true
    }
    if (STAT_NODEEDIT) {
        jMap.controller.stopNodeEdit(true)
    }
    DRAG_POS.x = b.clientX;
    DRAG_POS.y = b.clientY;
    if (a.id == "paper_mapview") {
        jMap.DragPaper = true
    } else {
        if (a.id == "jinomap") {
            if (a.offsetLeft <= b.clientX && b.clientX < a.clientWidth + a.offsetLeft && a.offsetTop <= b.clientY && b.clientY < a.clientHeight + a.offsetTop) {
                jMap.DragPaper = true
            }
        }
    }
};
JinoControllerGuest.prototype.mouseUp = function (a) {
    a = a || window.event;
    jMap.DragPaper = false;
    jMap.positionChangeNodes = false
};
JinoControlleriPhone = function (a) {
    JinoControlleriPhone.superclass.call(this, a);
    if ("onorientationchange" in window) {
        document.body.onorientationchange = this.updateOrientation
    } else {
        window.onresize = this.updateOrientation
    }
};
extend(JinoControlleriPhone, JinoController);
JinoControlleriPhone.prototype.type = "JinoControlleriPhone";
JinoControlleriPhone.prototype.updateOrientation = function (a) {
    resize()
};
JinoControlleriPhone.prototype.mousemove = function (d) {
    (d.originalEvent || d).preventDefault();
    var c;
    if (!d) {
        var d = window.event
    }
    if (d.target) {
        c = d.target
    } else {
        if (d.srcElement) {
            c = d.srcElement
        }
    } if (c.nodeType == 3) {
        c = c.parentNode
    }
    if (c.id == "nodeEditor") {
        return true
    }
    var b = d.clientX - DRAG_POS.x;
    var a = d.clientY - DRAG_POS.y;
    DRAG_POS.x = d.clientX;
    DRAG_POS.y = d.clientY;
    if (jMap.DragPaper) {
        this.work.scrollTop -= a;
        this.work.scrollLeft -= b
    }
};
JinoControlleriPhone.prototype.mousedown = function (c) {
    (c.originalEvent || c).preventDefault();
    if (supportsTouch && (c.originalEvent || c).touches.length == 2) {
        var b = jMap.getSelecteds().getLastElement();
        if (b) {
            b.setFolding(!b.folded);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendants(b);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(b);
            jMap.layoutManager.layout(true)
        }
    }
    var a;
    if (!c) {
        var c = window.event
    }
    if (c.target) {
        a = c.target
    } else {
        if (c.srcElement) {
            a = c.srcElement
        }
    } if (a.nodeType == 3) {
        a = a.parentNode
    }
    if (a.id == "nodeEditor") {
        return true
    }
    if (STAT_NODEEDIT) {
        jMap.controller.stopNodeEdit(true)
    }
    DRAG_POS.x = c.clientX;
    DRAG_POS.y = c.clientY;
    if (a.id == "paper_mapview") {
        jMap.DragPaper = true
    } else {
        if (a.id == "jinomap") {
            if (a.offsetLeft <= c.clientX && c.clientX < a.clientWidth + a.offsetLeft && a.offsetTop <= c.clientY && c.clientY < a.clientHeight + a.offsetTop) {
                jMap.DragPaper = true
            }
        }
    }
};
JinoControlleriPhone.prototype.mouseup = function (a) {
    (a.originalEvent || a).preventDefault();
    jMap.DragPaper = false;
    jMap.positionChangeNodes = false
};
var HGAP = 20;
var VGAP = 5;
var TEXT_HGAP = 10;
var TEXT_VGAP = 10;
var FOLDER_RADIUS = 4;
var PERCEIVE_WIDTH = 30;
var NODE_SELECTED_COLOR = "#E02405";
var NODE_DROP_FOCUS_COLOR = "#808080";
var NODE_DEFALUT_COLOR = "#F4F4F4";
var EDGE_DEFALUT_COLOR = "#808080";
var NODE_CORNER_ROUND = 5;
var NODE_MOVING_IGNORE = 5;
var NODE_FONT_SIZE_ENUM = ["30", "18", "12"];
var events = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend orientationchange touchcancel gesturestart gesturechange gestureend dragstart dragenter dragexit drop".split(" ");
var supportsTouch = "createTouch" in document,
    touchMap = {
        mousedown: "touchstart",
        mousemove: "touchmove",
        mouseup: "touchend",
        click: "click"
    };
var RAPHAEL = null;
var STAT_NODEEDIT = false;
var CLIPBOARD_DATA = "";
var DRAG_POS = {
    x: 0,
    y: 0
};
var J_NODE_CREATING = false;
var ACTIONS = {
    ACTION_NEW_NODE: "action_NewNode",
    ACTION_NODE_REMOVE: "action_NodeRemove",
    ACTION_NODE_EDITED: "action_NodeEdited",
    ACTION_NODE_SELECTED: "action_NodeSelected",
    ACTION_NODE_FOLDING: "action_NodeFolding",
    ACTION_NODE_MOVED: "action_NodeMoved",
    ACTION_NODE_COORDMOVED: "action_NodeCoordMoved",
    ACTION_NODE_HYPER: "action_NodeHyper",
    ACTION_NODE_IMAGE: "action_NodeImage",
    ACTION_NODE_PASTE: "action_NodePaste",
    ACTION_NODE_UNDO: "action_NodeUndo",
    ACTION_NODE_REDO: "action_NodeRedo",
    ACTION_NODE_FOREIGNOBJECT: "action_NodeForeignObject"
};
var ISMOBILE = ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)));
JinoMap = function (b, a, c, d) {
    RAPHAEL = Raphael(b, a, c);
    RAPHAEL.canvas.id = "paper_mapview";
    this.selectedNodes = new Array();
    this.DragPaper = false;
    this.positionChangeNodes = false;
    this.movingNode = false;
    this.isSavedFlag = true;
    this.indexColor = 0;
    this.mouseRightClicked = false;
    this.scaleTimes = 1;
    this._enableDragPaper = true;
    this.mode = d || 0;
    this.Listeners = new Array();
    this.statusBar = null;
    this.tootipHandle = $('<div style="position:absolute" id="jinomap_tooltip"></div>').appendTo($("#jinomap")).hide();
    this.nodeEditorHandle = $('<textarea id="nodeEditor" value="" style="position:absolute;top:0px;left:0px;width:100px;height:0px;overflow:hidden;display:none" />').appendTo($("#jinomap"));
    this.nodes = new Array();
    this.arrowlinks = new Array();
    this.work = $("#" + b)[0];
    if (ISMOBILE) {
        this.controller = this.mode ? new JinoControlleriPhone(this) : new JinoControlleriPhone(this)
    } else {
        this.controller = this.mode ? new JinoController(this) : new JinoControllerGuest(this)
    }
    this.loadManager = new jLoadManager(this);
    this.layoutManager = new jMindMapLayout(this);
    this.saveAction = new jSaveAction(this);
    this.clipboardManager = new jClipboardManager(this);
    this.nodeEditorHandle.textGrow({
        pad: 25,
        min_limit: 70,
        max_limit: 1000
    });
    this.work.focused = false;
    this.work.hasFocus = function () {
        return this.focused
    };
    this.work.onfocus = function () {
        this.focused = true
    };
    this.work.onblur = function () {
        this.focused = false
    };
    if (Raphael.svg) {
        this.groupEl = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.groupEl.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
        RAPHAEL.canvas && RAPHAEL.canvas.appendChild(this.groupEl)
    }
};
JinoMap.prototype.type = "JinoMap";
for (var i = events.length; i--;) {
    (function (a) {
        JinoMap.prototype[a] = function (b) {
            if (Raphael.is(b, "function")) {
                this.events = this.events || [];
                this.events.push({
                    name: a,
                    f: b,
                    unbind: addEvent(this.work, a, b, this)
                })
            }
            return this
        };
        JinoMap.prototype["un" + a] = function (d) {
            var c = this.events,
                b = c.length;
            while (b--) {
                if (c[b].name == a && c[b].f == d) {
                    c[b].unbind();
                    c.splice(b, 1);
                    !c.length && delete this.events;
                    return this
                }
            }
            return this
        }
    })(events[i])
}
JinoMap.prototype.deleteNodeById = function (a) {
    delete this.nodes[a]
};
JinoMap.prototype.getNodeById = function (a) {
    return this.nodes[a]
};
JinoMap.prototype.checkID = function (b) {
    if (!b) {
        return false
    }
    for (var a in this.nodes) {
        if (a == b) {
            return false
        }
    }
    return true
};
JinoMap.prototype.getRootNode = function () {
    return this.rootNode
};
JinoMap.prototype.setRootNode = function (a) {
    this.rootNode = a
};
JinoMap.prototype.addActionListener = function (a, b) {
    var c = {
        name: a,
        f: b
    };
    this.Listeners.push(c);
    return c
};
JinoMap.prototype.removeActionListener = function (a) {
    this.Listeners.remove(a)
};
JinoMap.prototype.fireActionListener = function () {
    if (arguments.length < 1) {
        return
    }
    var c = Array.prototype.slice.call(arguments, 0, 1)[0];
    var a = Array.prototype.slice.call(arguments, 1);
    var d = this.Listeners,
        b = d.length;
    while (b--) {
        if (!d[b]) {
            continue
        }
        if (d[b].name == c) {
            d[b].f.apply(this, a)
        }
    }
};
JinoMap.prototype.findNode = function (o, h, c, b, n) {
    if (!n) {
        n = new Array()
    }
    var d = b || this.rootNode;
    var l = "g";
    var p = /\\/g;
    var f = o.replace(p, "");
    p = /([\*\+\$\|\?\(\)\{\}\^\[\]])/g;
    f = f.replace(p, "\\$1");
    if (h) {
        if (f.substr(0, 1) != "^") {
            f = "^" + f
        }
        if (f.substr(f.length - 1, 1) != "$") {
            f = f + "$"
        }
    }
    if (c) {
        l = l + "i"
    }
    var m = new RegExp(f, l);
    var k = m.exec(d.getText());
    k && n.push({
        node: d,
        match: k
    });
    if (d.getChildren().length > 0) {
        var a = d.getChildren();
        for (var g = 0; g < a.length; g++) {
            this.findNode(o, h, c, a[g], n)
        }
    }
    return n
};
JinoMap.prototype.loadMap = function (a, b, c) {
    this.loadManager.loadMap(a, b, c)
};
JinoMap.prototype.newMap = function (a) {
    if (this.rootNode) {
        RAPHAEL.clear()
    }
    if (!a) {
        a = "newMap"
    }
    this.rootNode = this.createNodeWithCtrlExecute(null, a);
    this.rootNode.focus(true);
    this.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
    return this.rootNode;
    JinoUtil.waitingDialogClose()
};
JinoMap.prototype.getSelecteds = function () {
    return this.selectedNodes
};
JinoMap.prototype.getSelected = function () {
    return this.getSelecteds().getLastElement()
};
JinoMap.prototype.isSaved = function () {
    return this.isSavedFlag
};
JinoMap.prototype.setSaved = function (a) {
    this.isSavedFlag = a
};
JinoMap.prototype.setLayoutManager = function (a) {
    this.layoutManager = a;
    this.changeLineOfWholeMap(this.getRootNode());
    this.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap()
};
JinoMap.prototype.changeLineOfWholeMap = function (d) {
    if (d.connection) {
        d.connection.remove();
        switch (this.layoutManager.type) {
        case "jMindMapLayout":
            d.connection = d.parent && new jLineBezier(d.parent, d);
            break;
        case "jTreeLayout":
            d.connection = d.parent && new jLinePolygonal(d.parent, d);
            break;
        case "jRotateLayout":
            d.connection = d.parent && new jLineBezier(d.parent, d);
            break;
        default:
        }
        if (d.hided) {
            d.connection.hide()
        }
    }
    var c = new Array();
    for (var b = 0; b < d.arrowlinks.length; b++) {
        c.push(d.arrowlinks[b].destinationNode);
        d.removeArrowLink(d.arrowlinks[b])
    }
    for (var b = 0; b < c.length; b++) {
        var f = null;
        switch (jMap.layoutManager.type) {
        case "jMindMapLayout":
            f = new CurveArrowLink(c[b]);
            break;
        case "jTreeLayout":
            f = new RightAngleArrowLink(c[b]);
            break;
        default:
        }
        d.addArrowLink(f)
    }
    if (d.hided) {
        d.hide()
    }
    if (d.getChildren().length > 0) {
        var a = d.getChildren();
        for (var b = 0; b < a.length; b++) {
            this.changeLineOfWholeMap(a[b])
        }
    }
};
JinoMap.prototype.getLayoutManager = function () {
    return this.layoutManager
};
JinoMap.prototype.showBlinkStatusBar = function (a) {
    if (!this.statusBar || this.statusBar.removed) {
        this.statusBar = this.body = RAPHAEL.text();
        this.statusBar.attr({
            "font-size": 12,
            "text-anchor": "start",
            fill: "#000",
            opacity: 0
        })
    }
    this.statusBar.attr({
        text: a,
        x: this.work.scrollLeft + 15,
        y: this.work.scrollTop + this.work.offsetHeight - 30
    });
    this.statusBar.animate({
        opacity: 1
    }, 500, function () {
        this.animate({
            opacity: 0
        }, 500)
    });
    this.aaa = $('<div style="position:absolute" id="aaa">aaaa</div>').appendTo($("#jinomap"))
};
JinoMap.prototype.createNodeWithCtrl = function (b, l, a, d, c) {
    var g = this.historyManager;
    var h = null;
    var k = this.createNodeWithCtrlExecute(b, l, a, d, c);
    var f = g && g.extractNode(k);
    g && g.addToHistory(h, f);
    this.saveAction.newAction(k);
    this.fireActionListener(ACTIONS.ACTION_NEW_NODE, k, d);
    this.setSaved(false);
    return k
};
JinoMap.prototype.createNodeWithCtrlExecute = function (b, h, k, f, a) {
    var g = new jRect(b, h, k, f, a);
    g.controller = this.mode ? new jNodeController(this) : new jNodeControllerGuest(this);
    g.addEventController(g.controller);
    g.drag(g.controller.move, g.controller.dragger, g.controller.up);
    if (typeof NodeColorMix !== "undefined") {
        if (g.isRootNode()) {
            g.setBackgroundColorExecute(rootColor);
            g.setTextColorExecute(rootTextColor)
        } else {
            if (g.getParent().isRootNode()) {
                this.indexColor = this.indexColor % iColor.length;
                c = iColor[this.indexColor];
                this.indexColor++;
                g.setBackgroundColorExecute(c);
                g.setEdgeColorExecute(NodeColorUtil.darker(Raphael.getRGB(c), darkFactor), 8)
            } else {
                var d = Raphael.getRGB(g.getParent().background_color);
                var c = NodeColorUtil.randomer(Raphael.getRGB(NodeColorUtil.brighter(d, fadeFactor)), randFactor);
                g.setBackgroundColorExecute(c);
                g.setEdgeColorExecute(NodeColorUtil.darker(Raphael.getRGB(c), darkFactor), 2)
            }
        }
    }
    return g
};
JinoMap.prototype.changePosition = function (f, c, a, b) {
    var g = this.changePositionExecute(f, c, a, b);
    for (var d = 0; d < g.length; d++) {
        jMap.saveAction.moveAction(g[d], f, b)
    }
    for (var d = 0; d < g.length; d++) {
        jMap.saveAction.editAction(g[d])
    }
    jMap.fireActionListener(ACTIONS.ACTION_NODE_MOVED, f, g, a, b);
    this.setSaved(false);
    return g
};
JinoMap.prototype.changePositionExecute = function (h, c, a, b) {
    var f = "<paste>";
    for (var g = 0; g < c.length; g++) {
        f += c[g].toXML();
        c[g].removeExecute()
    }
    f += "</paste>";
    var d = (b) ? b.getIndexPos() : null;
    var k = jMap.loadManager.pasteNode(h, f, d, a);
    return k
};
JinoMap.prototype.initFolding = function (c) {
    if (this.cfg.lazyLoading) {
        if (c.lazycomplete) {
            if (c.folded) {
                c.setFoldingExecute(c.folded)
            }
        } else {
            $.ajax({
                type: "post",
                async: false,
                url: jMap.cfg.contextPath + "/mindmap/childnodes.do",
                data: {
                    map: mapId,
                    node: c.getID()
                },
                beforeSend: function () {},
                success: function (g) {
                    var f = /numofchildren="([^"]*)/i;
                    var d = f.exec(g);
                    c.numofchildren = d[1];
                    if (c.numofchildren > 0) {
                        c.setFoldingExecute(true)
                    } else {
                        c.folderShape && c.folderShape.hide();
                        c.folded = false
                    }
                },
                error: function (g, d, f) {
                    alert("getChildnodes : " + d)
                },
                complete: function () {}
            })
        }
    } else {
        if (c.folded) {
            c.setFoldingExecute(c.folded)
        }
    } if (c.getChildren().length > 0) {
        var b = c.getChildren();
        for (var a = 0; a < b.length; a++) {
            this.initFolding(b[a])
        }
    }
};
JinoMap.prototype.initFoldingAll = function () {
    this.initFolding(this.getRootNode())
};
JinoMap.prototype.toXML = function () {
    var a = '<map version="0.9.0">\n';
    a += "<!-- To view this file, download free mind mapping software FreeMind from http://freemind.sourceforge.net -->\n";
    a += this.rootNode.toXML() + "\n";
    a += "</map>";
    return a
};
JinoMap.prototype.createNodeFromText = function (c, m, h) {
    var o = m.split("\n");
    var a = c;
    var g = c;
    var b = 0;
    var n = h;
    for (var d = 0; d < o.length; d++) {
        if (!h) {
            n = (o[d].charAt(0) == "\t") ? "\t" : "    "
        }
        var k = o[d].split(n);
        var l = k.length;
        var f = k[l - 1];
        while (true) {
            if (b == l - 1) {
                g = this.createNodeWithCtrl(g, f);
                b = l;
                break
            }
            if (!g.getParent()) {
                break
            }
            g = g.getParent();
            b = b - 1
        }
    }
};
JinoMap.prototype.createTextFromNode = function (d, c, g, f) {
    f = f ? f : 0;
    g = g ? g : "";
    var h = "";
    for (var b = 0; b < f; b++) {
        h = h + c
    }
    g = g + h + d.getText() + "\n";
    if (d.getChildren().length > 0) {
        var a = d.getChildren();
        f++;
        for (var b = 0; b < a.length; b++) {
            g = this.createTextFromNode(a[b], c, g, f)
        }
    }
    return g
};
JinoMap.prototype.setSessionTimeout = function () {
    if (!this.mode) {
        return null
    }
    this.sessionTimeout = setTimeout(function () {
        if (ISMOBILE) {
            alert("서비스 이용이 없어 자동 로그아웃 되었습니다.\n다시 로그인 하시기 바랍니다.");
            location.replace(jMap.cfg.contextPath + "/user/logout.do")
        }
        var b = function (g, d, k) {
            if (g == "logout") {
                location.replace(jMap.cfg.contextPath + "/user/logout.do")
            } else {
                if (g == "extension") {
                    var h = false;
                    if (window.XMLHttpRequest && !(window.ActiveXObject)) {
                        try {
                            h = new XMLHttpRequest()
                        } catch (l) {
                            h = false
                        }
                    } else {
                        if (window.ActiveXObject) {
                            try {
                                h = new ActiveXObject("Msxml2.XMLHTTP")
                            } catch (l) {
                                try {
                                    h = new ActiveXObject("Microsoft.XMLHTTP")
                                } catch (l) {
                                    h = false
                                }
                            }
                        }
                    } if (h) {
                        h.onreadystatechange = function () {
                            if (h.readyState == 4) {
                                var f = false;
                                if (h.status == 200) {
                                    console.log(h.responseText)
                                } else {}
                            }
                        };
                        h.open("GET", "/okmindmap/", true);
                        h.send(null)
                    }
                    jMap.resetSessionTimeout()
                }
            }
        };
        var a = '<center><font color="#ff0000">Timeout</font></center><br />서비스 이용이 없어 자동 로그아웃 되었습니다.<br />OK버튼을 눌러 다시 로그인 하시기 바랍니다.<br />';
        var c = $.prompt(a, {
            callback: b,
            persistent: true,
            top: "30%",
            buttons: {
                OK: "logout"
            }
        })
    }, 1500000)
};
JinoMap.prototype.resetSessionTimeout = function () {
    if (!this.mode) {
        return null
    }
    clearTimeout(this.sessionTimeout);
    this.setSessionTimeout()
};
JinoMap.prototype.scale = function (a, l) {
    if (Raphael.svg) {
        if (!l) {
            l = 1
        }
        var h = this.getSelected();
        var c = this.getViewScale(this.scaleTimes);
        var f = this.getViewScale(a);
        var g = (f - c) / l;
        var d = c;
        var k = this;
        var b = new TimeLine(30, l);
        b.onframe = function () {
            d = d + g;
            var n = RAPHAEL.getSize();
            var m = (1 - d) * (n.width / 2);
            var r = (1 - d) * (n.height / 2);
            var o = n.width * d;
            var q = n.height * d;
            var p = m + " " + r + " " + o + " " + q;
            RAPHAEL.canvas.setAttribute("viewBox", p);
            k.cfg.scale = n.width / o
        };
        b.onstart = function () {};
        b.onstop = function () {};
        b.start();
        this.scaleTimes = a
    }
};
JinoMap.prototype.getViewScale = function (c) {
    var b = Math.floor(c);
    var g = Math.floor((c * 10) % 10);
    var a = 0;
    if (1 < c) {
        a = 1 / Math.pow(10, b - 1) - (b + g - 1) / Math.pow(10, b)
    } else {
        var f = function (h) {
            var l = 0;
            while (h < 1) {
                h = h * 10;
                l = l + 1
            }
            var k = Math.round(11 - h - l) / 10;
            return l + k
        };
        a = f(parseFloat(c))
    }
    return a
};
JinoMap.prototype.scaleFromTransform = function (g, f) {
    if (Raphael.svg) {
        if (!f) {
            f = 1
        }
        var b = this.scaleTimes;
        var h = g;
        var d = (h - b) / f;
        var a = b;
        var c = new TimeLine(30, f);
        c.onframe = function () {
            a = a + d;
            jMap.scaleApply(a, jMap.getSelecteds().getLastElement())
        };
        c.onstart = function () {};
        c.onstop = function () {};
        c.start();
        this.scaleTimes = h
    }
};
JinoMap.prototype.scaleApply = function (d, c) {
    c.groupEl.setAttribute("transform", "scale(" + d + ")");
    c.connection && c.connection.line.node.setAttribute("transform", "scale(" + d + ")");
    if (c.getChildren().length > 0) {
        var b = c.getChildren();
        for (var a = 0; a < b.length; a++) {
            this.scaleApply(d, b[a])
        }
    }
};
JinoMap.prototype.enableDragPaper = function (a) {
    this._enableDragPaper = a
};
JinoMap.prototype.travelNodes = function (c) {
    if (c.getChildren().length > 0) {
        var b = c.getChildren();
        for (var a = 0; a < b.length; a++) {
            this.travelNodes(b[a])
        }
    }
};
JinoMap.prototype.getArrowLinks = function (c) {
    var b = new Array();
    var d = c.id;
    for (var a = 0; a < this.arrowlinks.length; a++) {
        if (this.arrowlinks[a].destination == d) {
            b.push(this.arrowlinks[a])
        }
    }
    return b
};
JinoMap.prototype.addArrowLink = function (a) {
    this.arrowlinks.push(a)
};
JinoMap.prototype.removeArrowLink = function (a) {
    this.arrowlinks.remove(a)
};
jClipboardManager = function (a) {
    this.clipboard = "";
    this.map = a
};
jClipboardManager.prototype.type = "jClipboardManager";
jClipboardManager.prototype.toClipboard = function (b, a) {
    this.clipboard = "<clipboard>";
    if (this.map.cfg.lazyLoading) {
        for (var d = 0; d < b.length; d++) {
            var g = b[d].getID();
            var f = this;
            $.ajax({
                type: "post",
                async: false,
                url: jMap.cfg.contextPath + "/mindmap/childnodes.do",
                data: {
                    map: mapId,
                    node: g,
                    alldescendant: true
                },
                beforeSend: function () {},
                success: function (h) {
                    if (a) {
                        h = h.replace(/ID_[^"]*/g, "")
                    }
                    f.clipboard += h
                },
                error: function (l, h, k) {
                    alert("editAction : " + h)
                },
                complete: function () {}
            })
        }
    } else {
        for (var d = 0; d < b.length; d++) {
            var c = b[d].toXML();
            this.clipboard += c
        }
    }
    this.clipboard += "</clipboard>"
};
jClipboardManager.prototype.getClipboardText = function () {
    return this.clipboard
};
JinoMap.prototype.cfg = {
    lazyLoading: false,
    contextPath: "",
    realtimeSave: true,
    scale: 1
};
JinoUtil = (function () {
    function a() {}
    a.trimStr = function (f, c) {
        if (!f) {
            return ""
        }
        var c = c || " \n\r\t\f";
        for (var d = 0; d < f.length; d++) {
            if (c.indexOf(f.charAt(d)) < 0) {
                break
            }
        }
        for (var b = f.length - 1; b >= d; b--) {
            if (c.indexOf(f.charAt(b)) < 0) {
                break
            }
        }
        return f.substring(d, b + 1)
    };
    a.waitingDialog = function (b) {
        if (ISMOBILE) {
            jQuery("#jinomap").showLoading()
        } else {
            $.prompt('<table border="0"><tr><td rowspan="2" style="vertical-align: top; padding-top: 2px;padding-right: 10px;"><img src="/images/wait16trans.gif"></td><td>' + b + "</td><tr><td>Please wait...</td></tr></table>", {
                top: "40%",
                prefix: "jqismooth2",
                buttons: {}
            })
        }
    };
    a.waitingDialogClose = function () {
        if (ISMOBILE) {
            jQuery("#jinomap").hideLoading()
        } else {
            $.prompt.close()
        }
    };
    a.xml2Str = function (b) {
        try {
            return (new XMLSerializer()).serializeToString(b)
        } catch (c) {
            try {
                return b.xml
            } catch (c) {
                alert("Xmlserializer not supported")
            }
        }
        return false
    };
    a.connectionShadow = function (B, z, m, h) {
        if (B.line && B.from && B.to) {
            m = B;
            B = m.from;
            z = m.to
        }
        var u = z.edge_width ? z.edge_width : 1;
        u = u * 2;
        var q = B.getBBox();
        var o = z.getBBox();
        var E = B.rotate();
        var C = z.rotate();
        var t = 0;
        if (isFinite(B.getBBox().width)) {
            t = q.width
        }
        var b = 0;
        if (isFinite(z.getBBox().width)) {
            b = o.width
        }
        var s = [{
                x: q.x + t / 2,
                y: q.y - 1
            }, {
                x: q.x + t / 2,
                y: q.y + q.height + 1
            }, {
                x: q.x - 1,
                y: q.y + q.height / 2
            }, {
                x: q.x + t + 1,
                y: q.y + q.height / 2
            }, {
                x: o.x + b / 2,
                y: o.y - 1
            }, {
                x: o.x + b / 2,
                y: o.y + o.height + 1
            }, {
                x: o.x - 1,
                y: o.y + o.height / 2
            }, {
                x: o.x + b + 1,
                y: o.y + o.height / 2
            }
        ];
        if (h) {
            var H = [2, 7]
        } else {
            var H = [3, 6]
        }
        var D = s[H[0]].x,
            g = s[H[0]].y - u / 2,
            w = s[H[1]].x,
            c = s[H[1]].y,
            n = Math.max(Math.abs(D - w) / 2, 10),
            l = Math.max(Math.abs(g - c) / 2, 10),
            A = [D, D, D - n, D + n][H[0]].toFixed(3),
            f = [g - l, g + l, g, g][H[0]].toFixed(3),
            x = [0, 0, 0, 0, w, w, w - n, w + n][H[1]].toFixed(3),
            d = [0, 0, 0, 0, g + l, g - l, c, c][H[1]].toFixed(3),
            k = g + u,
            F = [0, 0, 0, 0, w, w, w - n, w + n][H[1]],
            G = [D, D, D - n, D + n][H[0]];
        if (h) {
            if (g > c) {
                F = F - u;
                G = G - u
            } else {
                F = F + u;
                G = G + u
            }
        } else {
            if (g > c) {
                F = F + u;
                G = G + u
            } else {
                F = F - u;
                G = G - u
            }
        }
        F = F.toFixed(3);
        G = G.toFixed(3);
        var r = ["M", D.toFixed(3), g.toFixed(3), "C", A, f, x, d, w.toFixed(3), c.toFixed(3), "C", x, d, G, f, D.toFixed(3), k.toFixed(3)].join(",");
        if (m && m.line) {
            m.line.attr({
                path: r
            })
        } else {
            var v = typeof m == "string" ? m : "#000";
            return {
                line: RAPHAEL.path(r).attr({
                    stroke: v,
                    fill: "none"
                }),
                from: B,
                to: z
            }
        }
    };
    return a
})();
StringBuffer = function () {
    this.buffer = []
};
StringBuffer.prototype.add = function (a) {
    this.buffer[this.buffer.length] = a
};
StringBuffer.prototype.flush = function () {
    this.buffer.length = 0
};
StringBuffer.prototype.getLength = function () {
    return this.buffer.join("").length
};
StringBuffer.prototype.toString = function (a) {
    return this.buffer.join(a || "")
};

function copyPrototype(d, c) {
    var f = c.toString();
    var b = f.match(/\s*function (.*)\(/);
    if (b != null) {
        d.prototype[b[1]] = c
    }
    for (var a in c.prototype) {
        d.prototype[a] = c.prototype[a]
    }
}
function extend(a, c) {
    function b() {}
    b.prototype = c.prototype;
    a.prototype = new b();
    a.prototype.constructor = a;
    a.superclass = c;
    a.superproto = c.prototype
}
var Utf8 = {
    encode: function (b) {
        b = b.replace(/\r\n/g, "\n");
        var a = "";
        for (var f = 0; f < b.length; f++) {
            var d = b.charCodeAt(f);
            if (d < 128) {
                a += String.fromCharCode(d)
            } else {
                if ((d > 127) && (d < 2048)) {
                    a += String.fromCharCode((d >> 6) | 192);
                    a += String.fromCharCode((d & 63) | 128)
                } else {
                    a += String.fromCharCode((d >> 12) | 224);
                    a += String.fromCharCode(((d >> 6) & 63) | 128);
                    a += String.fromCharCode((d & 63) | 128)
                }
            }
        }
        return a
    },
    decode: function (a) {
        var b = "";
        var d = 0;
        var f = c1 = c2 = 0;
        while (d < a.length) {
            f = a.charCodeAt(d);
            if (f < 128) {
                b += String.fromCharCode(f);
                d++
            } else {
                if ((f > 191) && (f < 224)) {
                    c2 = a.charCodeAt(d + 1);
                    b += String.fromCharCode(((f & 31) << 6) | (c2 & 63));
                    d += 2
                } else {
                    c2 = a.charCodeAt(d + 1);
                    c3 = a.charCodeAt(d + 2);
                    b += String.fromCharCode(((f & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    d += 3
                }
            }
        }
        return b
    }
};
jLoadManager = function (a) {
    this.map = a
};
jLoadManager.prototype.type = "jLoadManager";
jLoadManager.prototype.cfg = {
    contextPath: "",
    mapId: -1,
    mapName: ""
};
jLoadManager.prototype.loadMap = function (b, c, d) {
    this.cfg.contextPath = b;
    this.cfg.mapId = c;
    this.cfg.mapName = d;
    var a = "";
    if (this.map.cfg.lazyLoading) {
        a = b + "/map/lazy/" + c + "/" + d;
        this.lazyConfig()
    } else {
        a = b + "/map/" + c + "/" + d
    }
    var f = false;
    if (window.XMLHttpRequest && !(window.ActiveXObject)) {
        try {
            f = new XMLHttpRequest()
        } catch (g) {
            f = false
        }
    } else {
        if (window.ActiveXObject) {
            try {
                f = new ActiveXObject("Msxml2.XMLHTTP")
            } catch (g) {
                try {
                    f = new ActiveXObject("Microsoft.XMLHTTP")
                } catch (g) {
                    f = false
                }
            }
        }
    } if (f) {
        f.onreadystatechange = function () {
            if (f.readyState == 4) {
                var h = false;
                if (f.status == 200) {
                    var k = Utf8.encode(f.responseText);
                    if (window.DOMParser) {
                        var l = new DOMParser();
                        h = l.parseFromString(k, "text/xml")
                    } else {
                        h = new ActiveXObject("Microsoft.XMLDOM");
                        h.async = "false";
                        h.loadXML(k)
                    }
                }
                if (h) {
                    jMap.loadManager.parseMM(h)
                }
                jMap.setSaved(true)
            }
        };
        f.open("GET", a, true);
        f.send(null)
    }
};
jLoadManager.prototype.loadMapLocal = function (b) {
    var a = false;
    a = this.loadMM(b);
    if (a) {
        this.parseMM(a)
    }
    jMap.setSaved(true)
};
jLoadManager.prototype.loadMM = function (c) {
    var a = null;
    if (BrowserDetect.browser == "Explorer") {
        a = new ActiveXObject("Microsoft.XMLDOM");
        a.async = "false";
        a.load(c)
    } else {
        var b = new XMLHttpRequest();
        b.open("GET", c, false);
        b.send("");
        a = b.responseXML
    }
    return a
};
jLoadManager.prototype.parseMM = function (a) {
    var d = a.childNodes.item(0).childNodes;
    for (var c = 0; c < d.length; c++) {
        if (d.item(c).nodeType == 1) {
            var b = d.item(c);
            var f = b.getAttribute("TEXT");
            var g = b.getAttribute("ID");
            jMap.rootNode = jMap.createNodeWithCtrlExecute(null, f, g);
            this.initNodeAttrs(jMap.rootNode, b);
            if (this.map.cfg.lazyLoading) {
                this.lazyLoading(jMap.rootNode)
            } else {
                this.initChildNodes(jMap.rootNode, b)
            }
        }
    }
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
    jMap.initFoldingAll();
    JinoUtil.waitingDialogClose()
};
jLoadManager.prototype.initChildNodes = function (m, d) {
    if (d.childNodes.length > 0) {
        var f = d.childNodes;
        for (var u = 0; u < f.length; u++) {
            var g = f.item(u);
            if (g.nodeType == 1) {
                if (g.nodeName == "node") {
                    var o = g.getAttribute("TEXT");
                    var q = g.getAttribute("ID");
                    var b = jMap.createNodeWithCtrlExecute(m, o, q);
                    this.initNodeAttrs(b, g);
                    this.initChildNodes(b, g)
                } else {
                    if (g.nodeName == "edge") {
                        this.initEdgeAttrs(m, g)
                    } else {
                        if (g.nodeName == "richcontent") {
                            var o = "";
                            this.parserElement(m, g, o)
                        } else {
                            if (g.nodeName == "foreignObject") {
                                var t = "";
                                var r = g.getAttribute("WIDTH");
                                var p = g.getAttribute("HEIGHT");
                                var l = g.childNodes;
                                for (var w = 0; w < l.length; w++) {
                                    t += JinoUtil.xml2Str(l.item(w))
                                }
                                t = t.replace("<![CDATA[", "");
                                t = t.replace("]]>", "");
                                m.setForeignObjectExecute(t, r, p);
                                var n = t.indexOf("src=") + 5;
                                var k = t.indexOf('"', n);
                                var h = t.substring(n, k);
                                m.setHyperlinkExecute(h)
                            } else {
                                if (g.nodeName == "arrowlink") {
                                    var c = this.createArrowLink(m, g);
                                    m.addArrowLink(c)
                                } else {
                                    if (g.nodeName == "info") {
                                        var s = g.attributes;
                                        for (var v = 0; v < s.length; v++) {
                                            if (s[v].nodeName) {
                                                m[s[v].nodeName.toLowerCase()] = s[v].nodeValue
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
jLoadManager.prototype.createArrowLink = function (b, a) {
    var c = null;
    switch (jMap.layoutManager.type) {
    case "jMindMapLayout":
        c = new CurveArrowLink();
        break;
    case "jTreeLayout":
        c = new RightAngleArrowLink();
        break;
    default:
    }
    c.destination = a.getAttribute("DESTINATION");
    c.color = a.getAttribute("COLOR");
    c.endArrow = a.getAttribute("ENDARROW");
    c.endInclination = a.getAttribute("ENDINCLINATION");
    c.id = a.getAttribute("ID");
    c.startArrow = a.getAttribute("STARTARROW");
    c.startInclination = a.getAttribute("STARTINCLINATION");
    return c
};
jLoadManager.prototype.parserElement = function (f, d, g) {
    if (d.childNodes.length > 0) {
        var c = d.childNodes;
        for (var b = 0; b < c.length; b++) {
            var h = c.item(b);
            if (h.nodeType == 1) {
                if (h.nodeName == "img") {
                    f.setImageExecute(h.getAttribute("src"))
                } else {
                    if (h.nodeName == "p") {
                        var a = JinoUtil.trimStr(f.getText());
                        if (h.childNodes.length > 0) {
                            if (a != null && a != "") {
                                a = a + "\n" + JinoUtil.trimStr(h.childNodes.item(0).nodeValue)
                            } else {
                                a = JinoUtil.trimStr(h.childNodes.item(0).nodeValue)
                            }
                        }
                        f.setTextExecute(a)
                    } else {
                        var a = JinoUtil.trimStr(f.getText());
                        if (h.childNodes.length > 0) {
                            if (a != null && a != "") {
                                a = a + "\n" + JinoUtil.trimStr(h.childNodes.item(0).nodeValue)
                            } else {
                                a = JinoUtil.trimStr(h.childNodes.item(0).nodeValue)
                            }
                        }
                        f.setTextExecute(a)
                    }
                }
            }
            this.parserElement(f, h, g)
        }
    }
};
jLoadManager.prototype.initEdgeAttrs = function (d, c) {
    var a = c.attributes;
    for (var b = 0; b < a.length; b++) {
        if (a[b].nodeName) {
            if (a[b].nodeName.toLowerCase() == "color") {
                d.setEdgeColorExecute(a[b].nodeValue);
                continue
            }
            if (a[b].nodeName.toLowerCase() == "width") {
                d.setEdgeColorExecute(null, a[b].nodeValue);
                continue
            }
            d.edge[a[b].nodeName.toLowerCase()] = a[b].nodeValue
        }
    }
};
jLoadManager.prototype.initNodeAttrs = function (d, c) {
    var a = c.attributes;
    for (var b = 0; b < a.length; b++) {
        if (a[b].nodeName) {
            if (a[b].nodeName.toLowerCase() == "text") {
                continue
            }
            if (a[b].nodeName.toLowerCase() == "id") {
                continue
            }
            if (a[b].nodeName.toLowerCase() == "background_color") {
                d.setBackgroundColorExecute(a[b].nodeValue);
                continue
            }
            if (a[b].nodeName.toLowerCase() == "color") {
                d.setTextColorExecute(a[b].nodeValue);
                continue
            }
            if (a[b].nodeName.toLowerCase() == "link") {
                d.setHyperlinkExecute(a[b].nodeValue);
                continue
            }
            if (a[b].nodeName.toLowerCase() == "folded") {
                d.folded = (a[b].nodeValue == "true") ? true : false;
                continue
            }
            d[a[b].nodeName.toLowerCase()] = a[b].nodeValue
        }
    }
};
jLoadManager.prototype.pasteNode = function (f, m, o, n, g) {
    if (!m) {
        return false
    }
    m = m.replace(/<foreignObject([^>]*)\">/ig, '<foreignObject$1">\n<![CDATA[\n');
    m = m.replace(/<\/foreignObject>/ig, "\n]]>\n</foreignObject>");
    if (window.DOMParser) {
        var b = new DOMParser();
        xmlDoc = b.parseFromString(m, "text/xml")
    } else {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(m)
    }
    var d = xmlDoc.firstChild;
    while (d.nodeType != 1 && (d.tagName != "clipboard" || d.tagName != "paste" || d.tagName != "okm" || d.tagName != "node")) {
        d = d.nextSibling;
        if (d == null) {
            return false
        }
    }
    var q = d.childNodes;
    var h = [];
    for (var l = 0; l < q.length; l++) {
        if (q.item(l).nodeType == 1) {
            var k = q.item(l);
            if (k.nodeName != "node") {
                continue
            }
            if (!g) {
                k.removeAttribute("POSITION")
            }
            var p = k.getAttribute("TEXT");
            var c = k.getAttribute("ID");
            var a = jMap.createNodeWithCtrlExecute(f, p, c, o, n);
            this.initNodeAttrs(a, k);
            this.initChildNodes(a, k);
            if (f.folded || f.hided) {
                f.hideChildren(f)
            }
            h.push(a)
        }
    }
    return h
};
jLoadManager.prototype.lazyLoading = function (a) {
    if (a.lazycomplete) {
        return
    }
    $.ajax({
        type: "post",
        async: false,
        url: jMap.cfg.contextPath + "/mindmap/childnodes.do",
        data: {
            map: this.cfg.mapId,
            node: a.getID()
        },
        beforeSend: function () {},
        success: function (d) {
            var b = jMap.loadManager.pasteNode(a, d, null, null, true);
            a.lazycomplete = new Date().valueOf();
            if (b.length > 0) {
                for (var c = 0; c < b.length; c++) {
                    if (b[c].numofchildren > 0) {
                        b[c].setFoldingExecute(true);
                        if (b[c].hided) {
                            b[c].folderShape && b[c].folderShape.hide()
                        }
                    } else {
                        b[c].lazycomplete = new Date().valueOf()
                    }
                }
            }
        },
        error: function (d, b, c) {
            alert("editAction : " + b)
        },
        complete: function () {}
    })
};
jLoadManager.prototype.lazyConfig = function () {
    this.lazyListeners = [];
    this.lazyListeners.push(jMap.addActionListener(ACTIONS.ACTION_NODE_FOLDING, function () {
        var a = arguments[0];
        jMap.loadManager.lazyLoading(a);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(a);
        jMap.layoutManager.layout(true)
    }));
    this.lazyListeners.push(jMap.addActionListener(ACTIONS.ACTION_NODE_MOVED, function () {
        var a = arguments[0];
        var b = arguments[1]
    }));
    this.lazyListeners.push(jMap.addActionListener(ACTIONS.ACTION_NEW_NODE, function () {
        var a = arguments[0];
        a.lazycomplete = new Date().valueOf()
    }));
    this.lazyListeners.push(jMap.addActionListener("DWR_InsertNode", function () {
        var a = arguments[0];
        a.lazycomplete = new Date().valueOf()
    }))
};
jLoadManager.prototype.removelazyListener = function () {
    var a = null;
    while (a = this.lazyListeners.pop()) {
        jMap.removeActionListener(a)
    }
    this.lazyListeners = []
};
var removeGradient = function (a) {
    bodyAttr = a.body.attr();
    delete bodyAttr.gradient;
    a.body.attr({
        fill: a.background_color,
        stroke: a.edge.color
    })
};
jNodeController = function (a) {
    this.map = a
};
jNodeController.prototype.type = "jNodeController";
jNodeController.prototype.mousedown = function (a) {
    var b = jMap.getSelecteds();
    if (a.button == 2) {
        jMap.mouseRightClicked = true;
        jMap.mouseRightSelectedNode = this
    }
    if (a.ctrlKey) {
        if (b.contains(this)) {
            this.blur()
        } else {
            this.focus(false)
        }
    } else {
        if (!b.contains(this)) {
            this.focus(true)
        }
    }
};
jNodeController.prototype.mouseup = function (g) {
    g = g || window.event;
    if (jMap.mouseRightClicked) {
        var d = jMap.mouseRightSelectedNode;
        jMap.mouseRightClicked = false;
        if (d == this) {
            return
        }
        var k = null;
        switch (jMap.layoutManager.type) {
        case "jMindMapLayout":
            k = new CurveArrowLink(this);
            break;
        case "jTreeLayout":
            k = new RightAngleArrowLink(this);
            break;
        default:
        }
        d.addArrowLink(k);
        jMap.layoutManager.layout(true)
    }
    if (jMap.movingNode && !jMap.movingNode.removed) {
        var a = jMap.positionChangeNodes;
        var b = this;
        if (a && !a.contains(b)) {
            jMap.movingNode.connection && jMap.movingNode.connection.line.remove();
            jMap.movingNode.remove();
            for (var c = 0; c < a.length; c++) {
                if (a[c].hadChildren(b)) {
                    removeGradient(b);
                    jMap.positionChangeNodes = false;
                    return
                }
            }
            var f = (g.offsetX) ? g.offsetX : g.layerX - this.getLocation().x;
            var h = this.body.getBBox().width / 2;
            var l = (f < h);
            var n = function () {
                b.folded && b.setFolding(false);
                var o = null;
                if (b.isRootNode()) {
                    o = l ? "left" : "right"
                }
                jMap.changePosition(b, a, o)
            };
            var m = function () {
                var o = null;
                if (b.getParent().isRootNode()) {
                    o = b.position
                }
                var p = b.nextSibling();
                jMap.changePosition(b.getParent(), a, o, b)
            };
            if (a) {
                if (b.isRootNode()) {
                    n()
                } else {
                    switch (jMap.layoutManager.type) {
                    case "jMindMapLayout":
                        if (this.isLeft()) {
                            l ? n() : m()
                        } else {
                            l ? m() : n()
                        }
                        break;
                    case "jTreeLayout":
                        l ? m() : n();
                        break;
                    default:
                    }
                }
            }
            removeGradient(b);
            jMap.initFolding(b);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
            jMap.layoutManager.layout(true);
            b.focus(true)
        }
        jMap.positionChangeNodes = false
    }
};
jNodeController.prototype.mousemove = function (a) {
    a = a || window.event;
    if (!jMap.positionChangeNodes && this.isFoldingHit(a) && !this.isRootNode() && !this.getChildren().isEmpty()) {
        document.body.style.cursor = "url('/images/folding_blue.png'),default"
    } else {
        document.body.style.cursor = "auto"
    }
};
jNodeController.prototype.mouseover = function (f) {
    f = f || window.event;
    if (jMap.positionChangeNodes && !jMap.getSelecteds().contains(this)) {
        if (jMap.movingNode && !jMap.movingNode.removed) {
            jMap.movingNode.hide();
            jMap.movingNode.connection && jMap.movingNode.connection.line.hide()
        }
        var a = (f.offsetX) ? f.offsetX : f.layerX - this.getLocation().x;
        var b = this.body.getBBox().width / 2;
        if (jMap.positionChangeNodes) {
            var d = 0;
            var c = 0;
            switch (jMap.layoutManager.type) {
            case "jMindMapLayout":
                if (this.isRootNode()) {
                    d = 0;
                    c = 180
                } else {
                    d = (this.isLeft()) ? 0 : 270;
                    c = (this.isLeft()) ? 270 : 180
                }
                break;
            case "jTreeLayout":
                if (this.isRootNode()) {
                    d = 180;
                    c = 180
                } else {
                    d = 0;
                    c = 90
                }
                break;
            default:
            }
            if (a < b) {
                this.body.attr({
                    gradient: d + "-" + NODE_DROP_FOCUS_COLOR + "-#ffffff",
                    stroke: NODE_DROP_FOCUS_COLOR
                })
            } else {
                this.body.attr({
                    gradient: c + "-" + NODE_DROP_FOCUS_COLOR + "-#ffffff",
                    stroke: NODE_DROP_FOCUS_COLOR
                })
            }
        }
    }
    if (jMap.mouseRightClicked) {
        this.focus(false)
    }
};
jNodeController.prototype.mouseout = function (a) {
    document.body.style.cursor = "auto";
    if (jMap.movingNode && !jMap.movingNode.removed) {
        jMap.movingNode.show();
        jMap.movingNode.connection && jMap.movingNode.connection.line.show()
    }
    if (jMap.positionChangeNodes && !jMap.getSelecteds().contains(this)) {
        removeGradient(this)
    }
    if (jMap.mouseRightClicked) {
        if (jMap.mouseRightSelectedNode == this) {
            return
        }
        this.blur()
    }
};
jNodeController.prototype.click = function (b) {
    var a;
    if (!b) {
        var b = window.event
    }
    if (b.target) {
        a = b.target
    } else {
        if (b.srcElement) {
            a = b.srcElement
        }
    } if (a.nodeType == 3) {
        a = a.parentNode
    }
    if (this.isFoldingHit(b) && a.nodeName != "image") {
        jMap.controller.foldingAction(this)
    }
};
jNodeController.prototype.dblclick = function (a) {
    jMap.controller.startNodeEdit(this)
};
jNodeController.prototype.dragstart = function (a) {
    a = a || window.event;
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
};
jNodeController.prototype.dragenter = function (a) {
    a = a || window.event;
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
    this.focus(true)
};
jNodeController.prototype.dragexit = function (a) {
    a = a || window.event;
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
    this.blur()
};
jNodeController.prototype.drop = function (d) {
    d = d || window.event;
    if (d.preventDefault) {
        d.preventDefault()
    } else {
        d.returnValue = false
    }
    var f = d.dataTransfer.getData("TEXT") || d.dataTransfer.getData("text/plain");
    var a = d.dataTransfer.getData("URL");
    var c = false;
    if (f.substr(0, 7) == "http://") {
        a = a || f;
        if (a) {
            this.setFoldingExecute(false);
            var b = jMap.createNodeWithCtrl(this, a);
            b.setHyperlink(a);
            c = true
        }
    } else {
        jMap.createNodeFromText(this, f);
        c = true
    } if (c) {
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(this);
        jMap.layoutManager.layout(true)
    }
};
jNodeController.prototype.dragger = function () {};
jNodeController.prototype.move = function (m, k, f, d) {
    if (jMap.mouseRightClicked) {
        return
    }
    if (!jMap.movingNode || jMap.movingNode.removed && !jMap.mouseRightClicked) {
        var g = jMap.getSelecteds();
        jMap.positionChangeNodes = g;
        jMap.movingNode = RAPHAEL.rect();
        var a = jMap.movingNode;
        a.ox = this.body.type == "rect" ? this.body.attr("x") : this.body.attr("cx");
        a.oy = this.body.type == "rect" ? this.body.attr("y") : this.body.attr("cy");
        var b = this.body.attr();
        delete b.scale;
        delete b.translation;
        delete b.gradient;
        b["fill-opacity"] = 0.2;
        b.fill = this.background_color;
        b.stroke = this.edge.color;
        a.attr(b);
        a.toBack()
    }
    var a = jMap.movingNode;
    var l = m / jMap.cfg.scale;
    var h = k / jMap.cfg.scale;
    var c = a.type == "rect" ? {
        x: a.ox + l,
        y: a.oy + h
    } : {
        cx: a.ox + l,
        cy: a.oy + h
    };
    a.attr(c)
};
jNodeController.prototype.up = function (c, b, a, k) {
    if (jMap.movingNode && !jMap.movingNode.removed) {
        jMap.movingNode.connection && jMap.movingNode.connection.line.remove();
        jMap.movingNode.remove();
        var g = c / jMap.cfg.scale;
        var d = b / jMap.cfg.scale;
        var h = (g > 0) ? g : -g;
        var f = (d > 0) ? d : -d;
        if (h > NODE_MOVING_IGNORE || f > NODE_MOVING_IGNORE) {
            this.relativeCoordinate(g, d)
        }
    }
};
jNodeControllerGuest = function () {};
jNodeControllerGuest.prototype.type = "jNodeControllerGuest";
jNodeControllerGuest.prototype.mousedown = function (a) {
    var b = jMap.getSelecteds();
    if (a.ctrlKey) {
        this.focus(false)
    } else {
        if (!b.contains(this)) {
            this.focus(true)
        }
    }
};
jNodeControllerGuest.prototype.mouseup = function (a) {
    a = a || window.event
};
jNodeControllerGuest.prototype.mousemove = function (a) {
    a = a || window.event;
    if (!jMap.positionChangeNodes && this.isFoldingHit(a) && !this.isRootNode() && !this.getChildren().isEmpty()) {
        document.body.style.cursor = "url('/images/folding_blue.png'),default"
    } else {
        document.body.style.cursor = "auto"
    }
};
jNodeControllerGuest.prototype.mouseover = function (a) {
    a = a || window.event
};
jNodeControllerGuest.prototype.mouseout = function (a) {
    document.body.style.cursor = "auto"
};
jNodeControllerGuest.prototype.click = function (a) {
    if (this.isFoldingHit(a)) {
        this.setFoldingExecute(!this.folded);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendants(this);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(this);
        jMap.layoutManager.layout(true)
    }
};
jNodeControllerGuest.prototype.dblclick = function (a) {};
jNodeControllerGuest.prototype.dragstart = function (a) {
    a = a || window.event;
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
};
jNodeControllerGuest.prototype.dragenter = function (a) {
    a = a || window.event;
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
};
jNodeControllerGuest.prototype.dragexit = function (a) {
    a = a || window.event;
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
};
jNodeControllerGuest.prototype.drop = function (a) {
    a = a || window.event;
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
};
jNodeControllerGuest.prototype.dragger = function () {};
jNodeControllerGuest.prototype.move = function (c, b, a, d) {};
jNodeControllerGuest.prototype.up = function (c, b, a, d) {};
jNodeControlleriPhone = function () {
    jNodeControlleriPhone.superclass.call(this)
};
extend(jNodeControlleriPhone, jNodeController);
jNodeControlleriPhone.prototype.type = "jNodeControlleriPhone";
jNodeControlleriPhone.prototype.mousedown = function (a) {
    (a.originalEvent || a).preventDefault();
    var b = jMap.getSelecteds();
    if (a.ctrlKey) {
        if (b.contains(this)) {
            this.blur()
        } else {
            this.focus(false)
        }
    } else {
        if (!b.contains(this)) {
            this.focus(true)
        }
    }
};
jNodeControlleriPhone.prototype.mouseup = function (f) {
    (f.originalEvent || f).preventDefault();
    if (jMap.movingNode && !jMap.movingNode.removed) {
        var a = jMap.positionChangeNodes;
        var b = this;
        if (a && !a.contains(b)) {
            jMap.movingNode.connection && jMap.movingNode.connection.line.remove();
            jMap.movingNode.remove();
            for (var c = 0; c < a.length; c++) {
                if (a[c].hadChildren(b)) {
                    removeGradient(b);
                    jMap.positionChangeNodes = false;
                    return
                }
            }
            var d = (f.offsetX) ? f.offsetX : f.layerX - this.getLocation().x;
            var g = this.body.getBBox().width / 2;
            var h = (d < g);
            var l = function () {
                var m = null;
                if (b.isRootNode()) {
                    m = h ? "left" : "right"
                }
                jMap.changePosition(b, a, m)
            };
            var k = function () {
                var m = null;
                if (b.getParent().isRootNode()) {
                    m = b.position
                }
                var n = b.nextSibling();
                jMap.changePosition(b.getParent(), a, m, b)
            };
            if (a) {
                if (b.isRootNode()) {
                    l()
                } else {
                    switch (jMap.layoutManager.type) {
                    case "jMindMapLayout":
                        if (this.isLeft()) {
                            h ? l() : k()
                        } else {
                            h ? k() : l()
                        }
                        break;
                    case "jTreeLayout":
                        h ? k() : l();
                        break;
                    default:
                    }
                }
            }
            removeGradient(b);
            jMap.initFolding(b);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
            jMap.layoutManager.layout(true);
            b.focus(true)
        }
        jMap.positionChangeNodes = false
    }
};
jNodeControlleriPhone.prototype.mousemove = function (a) {
    (a.originalEvent || a).preventDefault()
};
jNodeControlleriPhone.prototype.click = function (a) {
    (a.originalEvent || a).preventDefault();
    if (this.isFoldingHit(a)) {
        this.setFolding(!this.folded);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendants(this);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(this);
        jMap.layoutManager.layout(true)
    }
};
jSaveAction = function (a) {
    this.map = a
};
jSaveAction.prototype.type = "jSaveAction";
jSaveAction.prototype.cfg = {
    async: true,
    type: "post"
};
jSaveAction.prototype.newAction = function (f) {
    if (this.map.cfg.realtimeSave) {
        var c = f.toXML();
        var a = ' mapid="' + mapId + '"';
        var h = "";
        if (f.getParent()) {
            h = ' parent="' + f.getParent().getID() + '"'
        }
        var b = "";
        if (f.nextSibling()) {
            b = ' next="' + f.nextSibling().getID() + '"'
        }
        var g = "<new" + a + h + b + ">" + c + "</new>";
        var d = this;
        $.ajax({
            type: this.cfg.type,
            async: this.cfg.async,
            url: this.map.cfg.contextPath + "/mindmap/save.do",
            data: {
                action: g
            },
            beforeSend: function () {},
            success: function (m) {
                if (m == -1) {
                    if (J_NODE_CREATING) {
                        var l = null;
                        var k = null;
                        while (l = d.map.getSelecteds().pop()) {
                            k = l.getParent();
                            l.remove()
                        }
                        J_NODE_CREATING.focus(true);
                        d.map.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(k);
                        d.map.layoutManager.layout(true)
                    }
                    d.map.controller.stopNodeEdit(false)
                }
            },
            error: function (m, k, l) {
                alert("newAction : " + k)
            },
            complete: function () {}
        })
    }
};
jSaveAction.prototype.editAction = function (c) {
    if (this.map.cfg.realtimeSave) {
        if (c.removed) {
            return
        }
        var b = c.toXML();
        var a = ' mapid="' + mapId + '"';
        var d = "<edit" + a + ">" + b + "</edit>";
        $.ajax({
            type: this.cfg.type,
            async: this.cfg.async,
            url: this.map.cfg.contextPath + "/mindmap/save.do",
            data: {
                action: d
            },
            beforeSend: function () {},
            success: function (f) {},
            error: function (h, f, g) {
                alert("editAction : " + f)
            },
            complete: function () {}
        })
    }
};
jSaveAction.prototype.deleteAction = function (c) {
    if (this.map.cfg.realtimeSave) {
        if (c.removed) {
            return
        }
        var b = c.toXML();
        var a = ' mapid="' + mapId + '"';
        var d = "<delete" + a + ">" + b + "</delete>";
        $.ajax({
            type: this.cfg.type,
            async: this.cfg.async,
            url: this.map.cfg.contextPath + "/mindmap/save.do",
            data: {
                action: d
            },
            beforeSend: function () {},
            success: function (f) {},
            error: function (h, f, g) {
                alert("deleteAction : " + f)
            },
            complete: function () {}
        })
    }
};
jSaveAction.prototype.moveAction = function (f, d, h) {
    if (this.map.cfg.realtimeSave) {
        var c = f.toXML();
        var a = ' mapid="' + mapId + '"';
        var k = ' parent="' + d.getID() + '"';
        var b = (h) ? ' next="' + h.getID() + '"' : "";
        var g = "<move" + a + k + b + ">" + c + "</move>";
        $.ajax({
            type: this.cfg.type,
            async: this.cfg.async,
            url: this.map.cfg.contextPath + "/mindmap/save.do",
            data: {
                action: g
            },
            beforeSend: function () {},
            success: function (l) {},
            error: function (n, l, m) {
                alert("moveAction : " + l)
            },
            complete: function () {}
        })
    }
};
jSaveAction.prototype.pasteAction = function (d) {
    if (this.map.cfg.realtimeSave) {
        var c = d.toXML();
        var a = ' mapid="' + mapId + '"';
        var g = "";
        if (d.getParent()) {
            g = ' parent="' + d.getParent().getID() + '"'
        }
        var b = "";
        var f = "<new" + a + g + b + ">" + c + "</new>";
        $.ajax({
            type: this.cfg.type,
            async: this.cfg.async,
            url: this.map.cfg.contextPath + "/mindmap/save.do",
            data: {
                action: f
            },
            beforeSend: function () {},
            success: function (h) {},
            error: function (l, h, k) {
                alert("pasteAction : " + h)
            },
            complete: function () {}
        })
    }
};
var MAX_HISTORY_LENGTH = 50;
UndoRedoManager = function () {
    this.undoList = new Array();
    this.redoList = new Array()
};
UndoRedoManager.prototype.type = "UndoRedoManager";
UndoRedoManager.prototype.addToHistory = function (a, b) {
    this.undoList.push({
        undo: a,
        redo: b
    });
    if (this.undoList.length > MAX_HISTORY_LENGTH) {
        this.undoList.splice(0, 1)
    }
};
UndoRedoManager.prototype.undo = function () {
    if (this.undoList.length == 0) {
        return false
    }
    var c = this.undoList.pop();
    var d = c.undo && c.undo.id || c.redo.id;
    var a = jMap.getNodeById(d);
    this.redoList.push(c);
    var b = null;
    if (c.undo) {
        b = this.recoveryNode(a, c.undo);
        b.setFoldingExecute(b.folded)
    } else {
        a.removeExecute()
    }
    jMap.fireActionListener(ACTIONS.ACTION_NODE_UNDO, d, c.undo);
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
    return true
};
UndoRedoManager.prototype.redo = function () {
    if (this.redoList.length == 0) {
        return false
    }
    var c = this.redoList.pop();
    var d = c.redo && c.redo.id || c.undo.id;
    var a = jMap.getNodeById(d);
    this.undoList.push(c);
    var b = null;
    if (c.redo) {
        b = this.recoveryNode(a, c.redo);
        b.setFoldingExecute(b.folded)
    } else {
        a.removeExecute()
    }
    jMap.fireActionListener(ACTIONS.ACTION_NODE_REDO, d, c.redo);
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
    return true
};
UndoRedoManager.prototype.extractNode = function (g, a) {
    var h = {};
    var k = g.body.attr();
    delete k.gradient;
    k.fill = g.background_color;
    k.stroke = g.edge.color;
    k["stroke-width"] = g.stroke_width;
    h.body = k;
    var b = g.text.attr();
    h.text = b;
    var f = g.folderShape.attr();
    h.folderShape = f;
    h.hyperlink = g.hyperlink && g.hyperlink.attr().href;
    h.img = g.img && g.img.attr().src;
    h.note = g.note;
    h.background_color = g.background_color;
    h.color = g.color;
    h.folded = g.folded;
    h.id = g.id;
    h.plainText = g.plainText;
    h.link = g.link;
    h.position = g.position;
    h.style = g.style;
    h.created = g.created;
    h.modified = g.modified;
    h.hgap = g.hgap;
    h.vgap = g.vgap;
    h.vshift = g.vshift;
    h.SHIFT = g.SHIFT;
    h.relYPos = g.relYPos;
    h.treeWidth = g.treeWidth;
    h.treeHeight = g.treeHeight;
    h.leftTreeWidth = g.leftTreeWidth;
    h.rightTreeWidth = g.rightTreeWidth;
    h.upperChildShift = g.upperChildShift;
    h.edge = g.edge;
    h.stroke_width = g.stroke_width;
    h.fontSize = g.fontSize;
    if (g.foreignObjEl) {
        h.foreignObject_plainHtml = g.foreignObjEl.plainHtml;
        h.foreignObject_width = g.foreignObjEl.getAttribute("width");
        h.foreignObject_height = g.foreignObjEl.getAttribute("height")
    }
    h.parentid = g.getParent() && g.getParent().id;
    h.childPosition = g.getIndexPos();
    if (a) {
        h.child = new Array;
        if (g.getChildren().length > 0) {
            var d = g.getChildren();
            for (var c = 0; c < d.length; c++) {
                h.child.push(this.extractNode(d[c], a))
            }
        }
    }
    return h
};
UndoRedoManager.prototype.recoveryNode = function (d, f) {
    if (f.body.removed) {
        return
    }
    if (!d) {
        var a = jMap.getNodeById(f.parentid);
        var g = null;
        var b = null;
        if (f.id) {
            g = f.id
        }
        b = f.childPosition;
        d = jMap.createNodeWithCtrlExecute(a, "", g, b);
        a.folded && a.setFoldingExecute(a.folded);
        f.hyperlink && d.setHyperlinkExecute(f.hyperlink);
        f.img && d.setImageExecute(f.img)
    }
    d.body.attr(f.body);
    d.text.attr(f.text);
    d.folderShape.attr(f.folderShape);
    d.note = f.note;
    d.background_color = f.background_color;
    d.color = f.color;
    d.folded = f.folded;
    d.plainText = f.plainText;
    d.link = f.link;
    d.position = f.position;
    d.style = f.style;
    d.created = f.created;
    d.modified = f.modified;
    d.hgap = f.hgap;
    d.vgap = f.vgap;
    d.vshift = f.vshift;
    d.SHIFT = f.SHIFT;
    d.relYPos = f.relYPos;
    d.treeWidth = f.treeWidth;
    d.treeHeight = f.treeHeight;
    d.leftTreeWidth = f.leftTreeWidth;
    d.rightTreeWidth = f.rightTreeWidth;
    d.upperChildShift = f.upperChildShift;
    d.edge = f.edge;
    d.stroke_width = f.stroke_width;
    d.fontSize = f.fontSize;
    if (f.foreignObject_plainHtml) {
        d.setForeignObjectExecute(f.foreignObject_plainHtml, f.foreignObject_width, f.foreignObject_height)
    }
    if (f.child && f.child.length > 0) {
        for (var c = 0; c < f.child.length; c++) {
            this.recoveryNode(null, f.child[c])
        }
    }
    return d
};
jMindMapLayout = function (b) {
    this.map = b;
    this.HGAP = 30;
    this.VGAP = 10;
    this.xSize = 0;
    this.ySize = 0;
    var a = this.map.work;
    a.scrollLeft = Math.round((a.scrollWidth - a.offsetWidth) / 2);
    a.scrollTop = Math.round((a.scrollHeight - a.offsetHeight) / 2)
};
jMindMapLayout.prototype.type = "jMindMapLayout";
jMindMapLayout.prototype.layoutNode = function (g) {
    var a = 0;
    var f = g.hgap;
    if (isNaN(f)) {
        f = 0
    }
    if (g.isRootNode()) {
        a = 0
    } else {
        if (g.isLeft()) {
            a = -f - parseInt(g.body.getBBox().width) - parseInt(this.HGAP)
        } else {
            a = parseFloat(g.parent.body.getBBox().width) + parseFloat(f) + parseInt(this.HGAP)
        }
    }
    this.placeNode(g, a, g.relYPos);
    g.connectArrowLink();
    var d = jMap.getArrowLinks(g);
    for (var c = 0; c < d.length; c++) {
        d[c].draw()
    }
    if (g.folded == "false" || g.folded == false) {
        var b = g.getChildren();
        if (b != null && b.length > 0) {
            for (var c = 0; c < b.length; c++) {
                this.layoutNode(b[c])
            }
        }
    }
};
jMindMapLayout.prototype.layout = function (f) {
    var d = this.map.selectedNodes.getLastElement();
    f = f && (d != null && d.getLocation().x != 0 && d.getLocation().y != 0);
    var c = this.getRoot();
    var b = c.getLocation().x;
    var a = c.getLocation().y;
    if (f) {
        a = d.getLocation().y
    }
    this.resizeMap(c.treeWidth, c.treeHeight);
    this.layoutNode(this.getRoot())
};
jMindMapLayout.prototype.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors = function (a) {
    this.updateTreeHeightsAndRelativeYOfDescendants(a);
    if (!a.isRootNode()) {
        this.updateTreeHeightsAndRelativeYOfAncestors(a.getParent())
    }
};
jMindMapLayout.prototype.updateTreeHeightsAndRelativeYOfAncestors = function (a) {
    this.updateTreeGeometry(a);
    if (!a.isRootNode()) {
        this.updateTreeHeightsAndRelativeYOfAncestors(a.getParent())
    }
};
jMindMapLayout.prototype.updateTreeHeightsAndRelativeYOfWholeMap = function () {
    this.updateTreeHeightsAndRelativeYOfDescendants(this.getRoot());
    this.layout(false)
};
jMindMapLayout.prototype.updateTreeHeightsAndRelativeYOfDescendants = function (c) {
    var b = c.getUnChildren();
    if (b != null && b.length > 0) {
        for (var a = 0; a < b.length; a++) {
            this.updateTreeHeightsAndRelativeYOfDescendants(b[a])
        }
    }
    this.updateTreeGeometry(c)
};
jMindMapLayout.prototype.updateRelativeYOfChildren = function (g, c) {
    if (c == null || c.length == 0) {
        return
    }
    var m = g.vgap;
    var b = c[0];
    var a = 0;
    var f = 0;
    for (var h = 0; h < c.length; h++) {
        b = c[h];
        var d = this.getShiftUp(b);
        var k = this.getShiftDown(b);
        var l = b.getUpperChildShift();
        b.relYPos = parseInt(a) + parseInt(l) + parseInt(k);
        f += parseInt(l) + parseInt(d);
        a += parseInt(b.getTreeHeight()) + parseInt(d) + parseInt(k) + parseInt(m) + this.VGAP
    }
    f += parseInt(this.calcStandardTreeShift(g, c));
    for (var h = 0; h < c.length; h++) {
        b = c[h];
        b.relYPos -= f
    }
};
jMindMapLayout.prototype.getShiftUp = function (b) {
    var a = b.getShift();
    if (a < 0) {
        return -a
    } else {
        return 0
    }
};
jMindMapLayout.prototype.getShiftDown = function (b) {
    var a = b.getShift();
    if (a > 0) {
        return a
    } else {
        return 0
    }
};
jMindMapLayout.prototype.updateTreeGeometry = function (c) {
    if (c.isRootNode()) {
        var d = this.getRoot().getLeftChildren();
        var k = this.getRoot().getRightChildren();
        var f = this.calcTreeWidth(c, d);
        var l = this.calcTreeWidth(c, k);
        this.getRoot().setRootTreeWidths(f, l);
        this.updateRelativeYOfChildren(c, d);
        this.updateRelativeYOfChildren(c, k);
        var n = this.calcUpperChildShift(c, d);
        var p = this.calcUpperChildShift(c, k);
        this.getRoot().setRootUpperChildShift(n, p);
        var o = this.calcTreeHeight(c, n, d);
        var b = this.calcTreeHeight(c, p, k);
        this.getRoot().setRootTreeHeights(o, b)
    } else {
        var a = c.getUnChildren();
        var g = this.calcTreeWidth(c, a);
        c.setTreeWidth(g);
        this.updateRelativeYOfChildren(c, a);
        var h = this.calcUpperChildShift(c, a);
        c.setUpperChildShift(h);
        var m = this.calcTreeHeight(c, h, a);
        c.setTreeHeight(m)
    }
};
jMindMapLayout.prototype.calcTreeWidth = function (f, d) {
    var g = 0;
    if (d != null && d.length > 0) {
        for (var c = 0; c < d.length; c++) {
            var b = d[c];
            if (b != null) {
                var a = parseInt(b.getTreeWidth()) + parseInt(b.hgap) + this.HGAP;
                if (a > g) {
                    g = a
                }
            }
        }
    }
    return f.getSize().width + g
};
jMindMapLayout.prototype.calcTreeHeight = function (l, g, c) {
    var h = l.getSize().height;
    try {
        var k = c[0];
        var b = c[c.length - 1];
        var d = Math.min(k.relYPos - k.getUpperChildShift(), 0);
        var a = Math.max(b.relYPos - b.getUpperChildShift() + b.getTreeHeight(), h);
        return a - d
    } catch (f) {
        return h
    }
};
jMindMapLayout.prototype.calcUpperChildShift = function (c, a) {
    try {
        var f = a[0];
        var d = -f.relYPos + parseInt(f.getUpperChildShift());
        if (d > 0) {
            return d
        } else {
            return 0
        }
    } catch (b) {
        return 0
    }
};
jMindMapLayout.prototype.calcStandardTreeShift = function (f, d) {
    var c = f.getSize().height;
    if (d.length == 0) {
        return 0
    }
    var a = 0;
    var h = f.vgap;
    for (var b = 0; b < d.length; b++) {
        var g = d[b];
        if (g != null) {
            a += parseInt(g.getSize().height) + parseInt(h)
        }
    }
    return Math.max(parseInt(a) - parseInt(h) - parseInt(c), 0) / 2
};
jMindMapLayout.prototype.placeNode = function (d, c, b) {
    if (d.isRootNode()) {
        d.setLocation(this.getRootX(), this.getRootY())
    } else {
        var a = parseFloat(d.parent.getLocation().x) + parseFloat(c);
        var f = parseFloat(d.parent.getLocation().y) + parseFloat(b);
        d.setLocation(a, f)
    }
};
jMindMapLayout.prototype.resizeMap = function (d, a) {
    var f = false;
    var c = RAPHAEL.getSize().width;
    var k = RAPHAEL.getSize().height;
    var g = 0;
    var b = 0;
    var h = this.getRoot().getLocation();
    if (c < d * 2) {
        g = d * 2;
        b = k;
        f = true
    }
    if (k < a * 2) {
        g = c;
        b = a * 2;
        f = true;
        this.placeNode(this.getRoot())
    }
    if (f) {
        RAPHAEL.setSize(g, b);
        this.placeNode(this.getRoot(), this.getRootX(), this.getRootY());
        this.map.work.scrollLeft += (g - c) / 2;
        this.map.work.scrollTop += (b - k) / 2
    }
};
jMindMapLayout.prototype.getRootY = function () {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.height) * 0.5) - parseInt(this.getRoot().body.getBBox().height) / 2
};
jMindMapLayout.prototype.getRootX = function () {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.width) * 0.5) - parseInt(this.getRoot().body.getBBox().width) / 2
};
jMindMapLayout.prototype.getRoot = function () {
    return this.map.rootNode
};
jRotateLayout = function (b) {
    this.map = b;
    this.HGAP = 10;
    this.VGAP = 120;
    this.xSize = 0;
    this.ySize = 0;
    var a = this.map.work;
    a.scrollLeft = Math.round((a.scrollWidth - a.offsetWidth) / 2);
    a.scrollTop = Math.round((a.scrollHeight - a.offsetHeight) / 2)
};
jRotateLayout.prototype.type = "jRotateLayout";
jRotateLayout.prototype.layoutNode = function (f) {
    var g = 0;
    var d = f.hgap;
    if (isNaN(d)) {
        d = 0
    }
    if (f.isRootNode()) {
        g = 0
    } else {
        g = parseFloat(f.parent.body.getBBox().height) + parseFloat(d) + parseInt(this.HGAP)
    }
    this.placeNode(f, f.vshift, g);
    f.connectArrowLink();
    var c = jMap.getArrowLinks(f);
    for (var b = 0; b < c.length; b++) {
        c[b].draw()
    }
    if (f.folded == "false" || f.folded == false) {
        var a = f.getChildren();
        if (a != null && a.length > 0) {
            for (var b = 0; b < a.length; b++) {
                this.layoutNode(a[b])
            }
        }
    }
};
jRotateLayout.prototype.layout = function (f) {
    var d = this.map.selectedNodes.getLastElement();
    f = f && (d != null && d.getLocation().x != 0 && d.getLocation().y != 0);
    var c = this.getRoot();
    var b = c.getLocation().x;
    var a = c.getLocation().y;
    if (f) {
        a = d.getLocation().y
    }
    this.resizeMap(c.treeWidth, c.treeHeight);
    this.layoutNode(this.getRoot())
};
jRotateLayout.prototype.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors = function (a) {
    this.updateTreeHeightsAndRelativeYOfDescendants(a);
    if (!a.isRootNode()) {
        this.updateTreeHeightsAndRelativeYOfAncestors(a.getParent())
    }
};
jRotateLayout.prototype.updateTreeHeightsAndRelativeYOfAncestors = function (a) {
    this.updateTreeGeometry(a);
    if (!a.isRootNode()) {
        this.updateTreeHeightsAndRelativeYOfAncestors(a.getParent())
    }
};
jRotateLayout.prototype.updateTreeHeightsAndRelativeYOfWholeMap = function () {
    this.updateTreeHeightsAndRelativeYOfDescendants(this.getRoot());
    this.layout(false)
};
jRotateLayout.prototype.updateTreeHeightsAndRelativeYOfDescendants = function (c) {
    var b = c.getUnChildren();
    if (b != null && b.length > 0) {
        for (var a = 0; a < b.length; a++) {
            this.updateTreeHeightsAndRelativeYOfDescendants(b[a])
        }
    }
    this.updateTreeGeometry(c)
};
jRotateLayout.prototype.updateTreeGeometry = function (d) {
    var a = d.getUnChildren();
    var h = this.calcTreeWidth(d, a);
    d.setTreeWidth(h);
    var g = this.calcTreeHeight(d, a);
    d.setTreeHeight(g);
    var b = function (p, o, k) {
        var n = p.body.getBBox().width;
        if (!o[k]) {
            o[k] = 0
        }
        o[k] = (n > o[k]) ? n : o[k];
        if (p.getChildren().length > 0) {
            var m = p.getChildren();
            k++;
            for (var l = 0; l < m.length; l++) {
                b(m[l], o, k)
            }
        }
    };
    var c = [];
    b(jMap.getRootNode(), c, 0);
    if (d.isRootNode()) {
        d.setSize(this.getRoot().getSize().width, this.getRoot().getSize().height)
    } else {
        var f = d.getDepth();
        d.setSize(c[f], d.getSize().height)
    }
};
jRotateLayout.prototype.calcTreeHeight = function (d, c) {
    var b = d.getSize().height;
    if (c == null || c.length == 0) {
        return b
    }
    var g = null;
    var f = 0;
    for (var a = 0; a < c.length; a++) {
        g = c[a];
        f += parseInt(g.getTreeHeight())
    }
    return Math.max(b, f)
};
jRotateLayout.prototype.calcTreeWidth = function (c, b) {
    if (b == null || b.length == 0) {
        return c.getSize().width
    }
    var d = 0;
    for (var a = 0; a < b.length; a++) {
        d = Math.max(d, this.calcTreeWidth(b[a], b[a].getUnChildren()))
    }
    return d
};
jRotateLayout.prototype.wholePrevNode = function (g) {
    var a = g.getIndexPos();
    var f = 0;
    for (var c = 0; c < a; c++) {
        var d = g.getParent().getChildren();
        var b = d[c].getChildren();
        f += this.calcTreeHeight(d[c], b)
    }
    return f
};
jRotateLayout.prototype.placeNode = function (b, m, l) {
    var k = this.getRootX() + this.getRoot().getSize().width / 2;
    var f = this.getRootY() + this.getRoot().getSize().height / 2;
    var r = this.calcTreeHeight(this.getRoot(), this.getRoot().getChildren());
    var g = this.calcTreeHeight(b, b.getChildren());
    var h = function (w) {
        var u = {};
        var t = "matrix translate scale skewX skewY".split(" ");
        for (var v = 0; v < t.length; v++) {
            var x = new RegExp(t[v] + "[(]([^)]*)[)]", "ig");
            var s = x.exec(w);
            u[t[v]] = s ? s[1] : null
        }
        return u
    };
    var q = function (u, w, x, v) {
        var s = w + "," + x + "," + v;
        var B = null;
        var E = [];
        var D = u.groupEl.getAttribute("transform");
        B = h(D);
        B.rotate = s;
        E = [];
        for (var C in B) {
            if (B[C]) {
                E.push(C + "(" + B[C] + ")")
            }
        }
        u.groupEl.setAttribute("transform", E.join(" "));
        if (u.connection) {
            var A = u.connection.line.node.getAttribute("transform");
            B = h(A);
            B.rotate = s;
            E = [];
            for (var C in B) {
                if (B[C]) {
                    E.push(C + "(" + B[C] + ")")
                }
            }
            u.connection.line.node.setAttribute("transform", E.join(" "))
        }
        if (u.getChildren().length > 0) {
            var t = u.getChildren();
            for (var z = 0; z < t.length; z++) {
                q(t[z], w, x, v)
            }
        }
    };
    if (b.isRootNode()) {
        b.setLocation(this.getRootX(), this.getRootY())
    } else {
        if (b.getParent().isRootNode()) {
            var o = this.getRoot().getSize().width + this.getRootX() + this.VGAP;
            var n = this.getRoot().getSize().height / 2 + this.getRootY() - b.getSize().height / 2;
            b.setLocation(o, n);
            var d = this.wholePrevNode(b);
            var c = (d / r) * 360 - (g / r) * 180;
            q(b, c, k, f)
        } else {
            var o = 0;
            var n = 0;
            var a = this.getPrevSibling(b);
            if (a == null) {
                var p = b.getParent();
                n = parseInt(p.getLocation().y) - parseInt(p.getTreeHeight() / 2) - parseInt(p.getSize().height / 2) - parseInt(this.HGAP) + parseInt(b.getTreeHeight() / 2) - parseInt(b.getSize().height / 2) + parseInt(l)
            } else {
                n = parseInt(a.getLocation().y) + parseInt(a.getTreeHeight() / 2) + a.getSize().height / 2 + b.getTreeHeight() / 2 - b.getSize().height / 2 + parseInt(m) + parseInt(this.HGAP)
            }
            o = parseFloat(b.parent.getLocation().x) + parseFloat(m) + parseFloat(this.VGAP) + parseFloat(b.parent.getSize().width);
            b.setLocation(o, n)
        }
    }
};
jRotateLayout.prototype.resizeMap = function (d, a) {
    var f = false;
    var c = RAPHAEL.getSize().width;
    var k = RAPHAEL.getSize().height;
    var g = 0;
    var b = 0;
    var h = this.getRoot().getLocation();
    if (c < d * 2) {
        g = d * 2;
        b = k;
        f = true
    }
    if (k < a * 2) {
        g = c;
        b = a * 2;
        f = true;
        this.placeNode(this.getRoot())
    }
    if (f) {
        RAPHAEL.setSize(g, b);
        this.placeNode(this.getRoot(), this.getRootX(), this.getRootY());
        this.map.work.scrollLeft += (g - c) / 2;
        this.map.work.scrollTop += (b - k) / 2
    }
};
jRotateLayout.prototype.getRootY = function () {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.height) * 0.5) - parseInt(this.getRoot().body.getBBox().height) / 2
};
jRotateLayout.prototype.getRootX = function () {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.width) * 0.5) - parseInt(this.getRoot().body.getBBox().width) / 2
};
jRotateLayout.prototype.getRoot = function () {
    return this.map.rootNode
};
jRotateLayout.prototype.getPrevSibling = function (b) {
    if (b.isRootNode()) {
        return null
    }
    var a = b.parent.children.indexOf(b);
    if (a < 1) {
        return null
    }
    return b.parent.children[a - 1]
};
jTableLayout = function (b) {
    this.map = b;
    this.HGAP = 0;
    this.VGAP = 0;
    this.xSize = 0;
    this.ySize = 0;
    var a = this.map.work;
    a.scrollLeft = Math.round((a.scrollWidth - a.offsetWidth) / 2);
    a.scrollTop = Math.round((a.scrollHeight - a.offsetHeight) / 2)
};
jTableLayout.prototype.type = "jTableLayout";
jTableLayout.prototype.layoutNode = function (g) {
    var a = 0;
    var d = g.wgap;
    if (isNaN(d)) {
        d = 0
    }
    if (g.isRootNode()) {
        y = 0
    } else {
        y = parseFloat(g.parent.body.getBBox().width)
    }
    this.placeNode(g, a, g.vshift);
    g.connectArrowLink();
    var f = jMap.getArrowLinks(g);
    for (var c = 0; c < f.length; c++) {
        f[c].draw()
    }
    if (g.folded == "false" || g.folded == false) {
        var b = g.getChildren();
        if (b != null && b.length > 0) {
            for (var c = 0; c < b.length; c++) {
                this.layoutNode(b[c])
            }
        }
    }
};
jTableLayout.prototype.layout = function (f) {
    var d = this.map.selectedNodes.getLastElement();
    f = f && (d != null && d.getLocation().x != 0 && d.getLocation().y != 0);
    var c = this.getRoot();
    var b = c.getLocation().x;
    var a = c.getLocation().y;
    if (f) {
        b = d.getLocation().x
    }
    this.resizeMap(c.treeWidth, c.treeHeight);
    this.layoutNode(this.getRoot())
};
jTableLayout.prototype.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors = function (a) {
    this.updateTreeHeightsAndRelativeYOfDescendants(a);
    if (!a.isRootNode()) {
        this.updateTreeHeightsAndRelativeYOfAncestors(a.getParent())
    }
};
jTableLayout.prototype.updateTreeHeightsAndRelativeYOfAncestors = function (a) {
    this.updateTreeGeometry(a);
    if (!a.isRootNode()) {
        this.updateTreeHeightsAndRelativeYOfAncestors(a.getParent())
    }
};
jTableLayout.prototype.updateTreeHeightsAndRelativeYOfWholeMap = function () {
    this.updateTreeHeightsAndRelativeYOfDescendants(this.getRoot());
    this.layout(false)
};
jTableLayout.prototype.updateTreeHeightsAndRelativeYOfDescendants = function (c) {
    var b = c.getUnChildren();
    if (b != null && b.length > 0) {
        for (var a = 0; a < b.length; a++) {
            this.updateTreeHeightsAndRelativeYOfDescendants(b[a])
        }
    }
    this.updateTreeGeometry(c)
};
jTableLayout.prototype.maxDepth = function (c) {
    var b = c.getUnChildren();
    if (b == null || b.length == 0) {
        return c.getDepth()
    }
    var d = 0;
    for (var a = 0; a < b.length; a++) {
        d = Math.max(d, this.maxDepth(b[a]))
    }
    return d
};
jTableLayout.prototype.makeNode = function (c, d) {
    var b = c.getUnChildren();
    if (b == null || b.length == 0) {
        if (c.getDepth() < d) {
            this.map.createNodeWithCtrl(c, "")
        }
    }
    for (var a = 0; a < b.length; a++) {
        this.makeNode(b[a], d)
    }
};
jTableLayout.prototype.updateTreeGeometry = function (c) {
    var b = c.getUnChildren();
    var f = c.getDepth();
    var g = this.calcTreeWidth(c, b);
    c.setTreeWidth(g);
    var k = this.calcTreeHeight(c, b);
    c.setTreeHeight(k);
    var a = this.calcTreeWidth1(c);
    if (c.isRootNode()) {
        c.setSize(this.getRoot().getSize().width, this.getRoot().getSize().height)
    } else {
        c.setSize(a, k)
    }
    var d = function (r, q, m) {
        var p = r.body.getBBox().width;
        if (!q[m]) {
            q[m] = 0
        }
        q[m] = (p > q[m]) ? p : q[m];
        if (r.getChildren().length > 0) {
            var o = r.getChildren();
            m++;
            for (var n = 0; n < o.length; n++) {
                d(o[n], q, m)
            }
        }
    };
    var l = [];
    d(jMap.getRootNode(), l, 0);
    if (f == 0) {
        c.setSize(this.getRoot().getSize().width, this.getRoot().getSize().height)
    } else {
        c.setSize(l[f], k)
    }
    var h = this.maxDepth(this.getRoot())
};
jTableLayout.prototype.calcTreeHeight = function (d, c) {
    var b = d.getSize().height;
    if (c == null || c.length == 0) {
        return b
    }
    var g = null;
    var f = 0;
    for (var a = 0; a < c.length; a++) {
        g = c[a];
        f += parseInt(g.getTreeHeight())
    }
    f -= parseInt(c.length - 1) * 0.2;
    return Math.max(b, f)
};
jTableLayout.prototype.calcTreeWidth = function (c, b) {
    if (b == null || b.length == 0) {
        return c.getSize().width
    }
    var d = 0;
    for (var a = 0; a < b.length; a++) {
        d = Math.max(d, this.calcTreeWidth(b[a], b[a].getUnChildren()))
    }
    return d
};
jTableLayout.prototype.calcTreeWidth1 = function (c) {
    if (c.isRootNode()) {
        return 0
    } else {
        var b = c.getParent().getChildren();
        if (b.length == 1) {
            return c.getSize().width
        }
        var d = 0;
        for (var a = 0; a < b.length; a++) {
            d = Math.max(d, b[a].getSize().width)
        }
        return d
    }
};
jTableLayout.prototype.placeNode = function (g, f, c) {
    if (g.isRootNode()) {
        g.setLocation(this.getRootX(), this.getRootY())
    } else {
        var a = 0;
        var h = 0;
        var b = this.getPrevSibling(g);
        if (b == null) {
            var d = g.getParent();
            h = parseInt(d.getLocation().y)
        } else {
            h = parseInt(b.getLocation().y) + parseInt(b.getSize().height)
        }
        a = parseFloat(g.parent.getLocation().x) + parseFloat(g.parent.getSize().width);
        g.setLocation(a, h)
    }
};
jTableLayout.prototype.resizeMap = function (d, a) {
    var f = false;
    var c = RAPHAEL.getSize().width;
    var k = RAPHAEL.getSize().height;
    var g = 0;
    var b = 0;
    var h = this.getRoot().getLocation();
    if (c < d * 2) {
        g = d * 2;
        b = k;
        f = true
    }
    if (k < a * 2) {
        g = c;
        b = a * 2;
        f = true;
        this.placeNode(this.getRoot())
    }
    if (f) {
        RAPHAEL.setSize(g, b);
        this.placeNode(this.getRoot(), this.getRootX(), this.getRootY());
        this.map.work.scrollLeft += (g - c) / 2;
        this.map.work.scrollTop += (b - k) / 2
    }
};
jTableLayout.prototype.getRootY = function () {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.height) * 0.5) - parseInt(this.getRoot().body.getBBox().height) / 2
};
jTableLayout.prototype.getRootX = function () {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.width) * 0.5) - parseInt(this.getRoot().body.getBBox().width) / 2
};
jTableLayout.prototype.getRoot = function () {
    return this.map.rootNode
};
jTableLayout.prototype.getPrevSibling = function (b) {
    if (b.isRootNode()) {
        return null
    }
    var a = b.parent.children.indexOf(b);
    if (a < 1) {
        return null
    }
    return b.parent.children[a - 1]
};
jTreeLayout = function (b) {
    this.map = b;
    this.HGAP = 10;
    this.VGAP = 20;
    this.xSize = 0;
    this.ySize = 0;
    var a = this.map.work;
    a.scrollLeft = Math.round((a.scrollWidth - a.offsetWidth) / 2);
    a.scrollTop = Math.round((a.scrollHeight - a.offsetHeight) / 2)
};
jTreeLayout.prototype.type = "jTreeLayout";
jTreeLayout.prototype.layoutNode = function (f) {
    var g = 0;
    var d = f.hgap;
    if (isNaN(d)) {
        d = 0
    }
    if (f.isRootNode()) {
        g = 0
    } else {
        g = parseFloat(f.parent.body.getBBox().height) + parseFloat(d) + parseInt(this.HGAP)
    }
    this.placeNode(f, f.vshift, g);
    f.connectArrowLink();
    var c = jMap.getArrowLinks(f);
    for (var b = 0; b < c.length; b++) {
        c[b].draw()
    }
    if (f.folded == "false" || f.folded == false) {
        var a = f.getChildren();
        if (a != null && a.length > 0) {
            for (var b = 0; b < a.length; b++) {
                this.layoutNode(a[b])
            }
        }
    }
};
jTreeLayout.prototype.layout = function (f) {
    var d = this.map.selectedNodes.getLastElement();
    f = f && (d != null && d.getLocation().x != 0 && d.getLocation().y != 0);
    var c = this.getRoot();
    var b = c.getLocation().x;
    var a = c.getLocation().y;
    if (f) {
        a = d.getLocation().y
    }
    this.resizeMap(c.treeWidth, c.treeHeight);
    this.layoutNode(this.getRoot())
};
jTreeLayout.prototype.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors = function (a) {
    this.updateTreeHeightsAndRelativeYOfDescendants(a);
    if (!a.isRootNode()) {
        this.updateTreeHeightsAndRelativeYOfAncestors(a.getParent())
    }
};
jTreeLayout.prototype.updateTreeHeightsAndRelativeYOfAncestors = function (a) {
    this.updateTreeGeometry(a);
    if (!a.isRootNode()) {
        this.updateTreeHeightsAndRelativeYOfAncestors(a.getParent())
    }
};
jTreeLayout.prototype.updateTreeHeightsAndRelativeYOfWholeMap = function () {
    this.updateTreeHeightsAndRelativeYOfDescendants(this.getRoot());
    this.layout(false)
};
jTreeLayout.prototype.updateTreeHeightsAndRelativeYOfDescendants = function (c) {
    var b = c.getUnChildren();
    if (b != null && b.length > 0) {
        for (var a = 0; a < b.length; a++) {
            this.updateTreeHeightsAndRelativeYOfDescendants(b[a])
        }
    }
    this.updateTreeGeometry(c)
};
jTreeLayout.prototype.updateTreeGeometry = function (b) {
    var a = b.getUnChildren();
    var d = this.calcTreeWidth(b, a);
    b.setTreeWidth(d);
    var c = this.calcTreeHeight(b, a);
    b.setTreeHeight(c)
};
jTreeLayout.prototype.calcTreeWidth = function (d, b) {
    var c = d.getSize().width;
    if (b == null || b.length == 0) {
        return c
    }
    var g = null;
    var f = 0;
    for (var a = 0; a < b.length; a++) {
        g = b[a];
        f += parseInt(g.getTreeWidth()) + parseInt(g.vshift)
    }
    f += parseInt(this.HGAP) * parseInt(b.length - 1);
    return Math.max(c, f)
};
jTreeLayout.prototype.calcTreeHeight = function (c, b) {
    if (b == null || b.length == 0) {
        return c.getSize().height
    }
    var d = 0;
    for (var a = 0; a < b.length; a++) {
        d = Math.max(d, this.calcTreeHeight(b[a], b[a].getUnChildren()) + b[a].vshift)
    }
    return d
};
jTreeLayout.prototype.placeNode = function (g, f, c) {
    if (g.isRootNode()) {
        g.setLocation(this.getRootX(), this.getRootY())
    } else {
        var a = 0;
        var h = 0;
        var b = this.getPrevSibling(g);
        if (b == null) {
            var d = g.getParent();
            a = parseInt(d.getLocation().x) - parseInt(d.getTreeWidth() / 2) + parseInt(d.getSize().width / 2) + parseInt(g.getTreeWidth() / 2) - parseInt(g.getSize().width / 2) + parseInt(f)
        } else {
            a = parseInt(b.getLocation().x) + parseInt(b.getTreeWidth() / 2) + b.getSize().width / 2 + g.getTreeWidth() / 2 - g.getSize().width / 2 + parseInt(f) + parseInt(this.HGAP)
        }
        h = parseFloat(g.parent.getLocation().y) + parseFloat(c) + parseFloat(this.VGAP);
        g.setLocation(a, h)
    }
};
jTreeLayout.prototype.resizeMap = function (d, a) {
    var f = false;
    var c = RAPHAEL.getSize().width;
    var k = RAPHAEL.getSize().height;
    var g = 0;
    var b = 0;
    var h = this.getRoot().getLocation();
    if (c < d * 2) {
        g = d * 2;
        b = k;
        f = true
    }
    if (k < a * 2) {
        g = c;
        b = a * 2;
        f = true;
        this.placeNode(this.getRoot())
    }
    if (f) {
        RAPHAEL.setSize(g, b);
        this.placeNode(this.getRoot(), this.getRootX(), this.getRootY());
        this.map.work.scrollLeft += (g - c) / 2;
        this.map.work.scrollTop += (b - k) / 2
    }
};
jTreeLayout.prototype.getRootY = function () {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.height) * 0.5) - parseInt(this.getRoot().body.getBBox().height) / 2
};
jTreeLayout.prototype.getRootX = function () {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.width) * 0.5) - parseInt(this.getRoot().body.getBBox().width) / 2
};
jTreeLayout.prototype.getRoot = function () {
    return this.map.rootNode
};
jTreeLayout.prototype.getPrevSibling = function (b) {
    if (b.isRootNode()) {
        return null
    }
    var a = b.parent.children.indexOf(b);
    if (a < 1) {
        return null
    }
    return b.parent.children[a - 1]
};
jNode = function (a, b, c) {
    this.groupEl = null;
    this.body = null;
    this.text = null;
    this.folderShape = null;
    this.img = null;
    this.hyperlink = null;
    this.arrowlinks = new Array();
    this.note = "";
    if (c && c != "" && jMap.checkID(c)) {
        this.id = c
    } else {
        this.id = this.CreateID()
    }
    this.plainText = b || "";
    this.folded = false;
    this.background_color = "";
    this.color = "";
    this.controller = null;
    this.layoutHeight = 0;
    this.connection = null;
    this.children = new Array();
    this.parent = null;
    this.edge = {};
    this.stroke_width = 1;
    this.fontSize = 10;
    this.hided = false;
    this.createAbstract(a)
};
jNode.prototype.type = "jNode";
for (var i = events.length; i--;) {
    (function (a) {
        jNode.prototype[a] = function (b) {
            if (Raphael.is(b, "function")) {
                this.events = this.events || [];
                this.events.push({
                    name: a,
                    f: b,
                    unbind: addEvent(this.groupEl, a, b, this)
                })
            }
            return this
        };
        jNode.prototype["un" + a] = function (d) {
            var c = this.events,
                b = c.length;
            while (b--) {
                if (c[b].name == a && c[b].f == d) {
                    c[b].unbind();
                    c.splice(b, 1);
                    !c.length && delete this.events;
                    return this
                }
            }
            return this
        }
    })(events[i])
}
if (Raphael.vml) {
    var createNode;
    document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
    try {
        !document.namespaces.rvml && document.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
        createNode = function (a) {
            return document.createElement("<rvml:" + a + ' class="rvml">')
        }
    } catch (e) {
        createNode = function (a) {
            return document.createElement("<" + a + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')
        }
    }
}
jNode.prototype.connectArrowLink = function () {
    for (var a = 0; a < this.arrowlinks.length; a++) {
        this.arrowlinks[a].draw()
    }
};
jNode.prototype.addArrowLink = function (a) {
    a.startNode = this;
    this.arrowlinks.push(a);
    jMap.addArrowLink(a);
    jMap.setSaved(false)
};
jNode.prototype.removeArrowLink = function (a) {
    a.remove();
    this.arrowlinks.remove(a);
    jMap.removeArrowLink(a);
    jMap.setSaved(false)
};
jNode.prototype.CreateID = function () {
    var a = "";
    while (!jMap.checkID(a)) {
        a = "ID_" + parseInt(Math.random() * 2000000000)
    }
    return a
};
jNode.prototype.createAbstract = function (a) {
    this.initElements();
    this.parent = a;
    jMap.nodes[this.id] = this;
    this.initCreate();
    this.create()
};
jNode.prototype.wrapElements = function () {
    if (Raphael.svg) {
        this.groupEl = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.groupEl.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
        if (jMap.groupEl) {
            jMap.groupEl.appendChild(this.groupEl)
        } else {
            RAPHAEL.canvas && RAPHAEL.canvas.appendChild(this.groupEl)
        }
        for (var a = 0; a < arguments.length; a++) {
            this.groupEl.appendChild(arguments[a].node)
        }
    }
    if (Raphael.vml) {
        this.groupEl = createNode("group");
        if (jMap.groupEl) {
            jMap.groupEl.appendChild(this.groupEl)
        } else {
            RAPHAEL.canvas.appendChild(this.groupEl)
        }
        for (var a = 0; a < arguments.length; a++) {
            this.groupEl.appendChild(arguments[a].Group)
        }
    }
};
jNode.prototype.getID = function () {
    return this.id
};
jNode.prototype.appendChild = function (a) {
    this.children.push(a)
};
jNode.prototype.insertChild = function (b, a) {
    this.index = a;
    this.children.insert(a, b)
};
jNode.prototype.getIndexPos = function () {
    if (!this.parent) {
        return -1
    }
    return this.parent.children.indexOf(this)
};
jNode.prototype.getParent = function () {
    return this.parent
};
jNode.prototype.setParent = function (a) {
    this.parent = a
};
jNode.prototype.getChildren = function () {
    return this.children
};
jNode.prototype.getUnChildren = function () {
    if (this.folded == true || this.folded == "true") {
        return null
    } else {
        return this.getChildren()
    }
};
jNode.prototype.isRootNode = function () {
    return this.parent == null
};
jNode.prototype.getText = function () {
    return this.text.attr().text
};
jNode.prototype.setText = function (d) {
    var c = jMap.historyManager;
    var a = c && c.extractNode(this);
    this.setTextExecute(d);
    var b = c && c.extractNode(this);
    c && c.addToHistory(a, b);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_EDITED, this);
    jMap.setSaved(false)
};
jNode.prototype.setTextExecute = function (a) {
    this.plainText = a;
    this.text.attr({
        text: a
    });
    this.CalcBodySize()
};
jNode.prototype.getFontSize = function () {
    return this.fontSize
};
jNode.prototype.setFontSize = function (c) {
    var d = jMap.historyManager;
    var a = d && d.extractNode(this);
    this.setFontSizeExecute(c);
    var b = d && d.extractNode(this);
    d && d.addToHistory(a, b);
    jMap.saveAction.editAction(this);
    jMap.setSaved(false)
};
jNode.prototype.setFontSizeExecute = function (a) {
    this.fontSize = a;
    this.text.attr({
        "font-size": a
    });
    this.CalcBodySize()
};
jNode.prototype.getTextColor = function () {
    return this.text.attr().fill
};
jNode.prototype.setTextColor = function (c) {
    var d = jMap.historyManager;
    var a = d && d.extractNode(this);
    this.setTextColorExecute(c);
    var b = d && d.extractNode(this);
    d && d.addToHistory(a, b);
    jMap.saveAction.editAction(this);
    jMap.setSaved(false)
};
jNode.prototype.setTextColorExecute = function (a) {
    this.color = a;
    this.text.attr({
        fill: a
    })
};
jNode.prototype.getBackgroundColor = function () {
    return this.body.attr().fill
};
jNode.prototype.setBackgroundColor = function (c, d) {
    var f = jMap.historyManager;
    var a = f && f.extractNode(this);
    this.setBackgroundColorExecute(c, d);
    var b = f && f.extractNode(this);
    f && f.addToHistory(a, b);
    jMap.saveAction.editAction(this);
    jMap.setSaved(false)
};
jNode.prototype.setBackgroundColorExecute = function (a, b) {
    if (a) {
        this.background_color = a;
        this.body.attr({
            fill: a
        });
        this.folderShape && this.folderShape.attr({
            fill: a
        })
    }
    if (b) {
        this.stroke_width = b;
        this.body.attr({
            "stroke-width": b
        })
    }
};
jNode.prototype.getEdgeColor = function () {
    return this.body.attr().stroke
};
jNode.prototype.setEdgeColor = function (c, d) {
    var f = jMap.historyManager;
    var a = f && f.extractNode(this);
    this.setEdgeColorExecute(c, d);
    var b = f && f.extractNode(this);
    f && f.addToHistory(a, b);
    jMap.saveAction.editAction(this);
    jMap.setSaved(false)
};
jNode.prototype.setEdgeColorExecute = function (a, b) {
    if (a) {
        this.edge.color = a;
        this.body.attr({
            stroke: a
        });
        this.folderShape && this.folderShape.attr({
            stroke: a
        })
    }
    if (b) {
        this.edge.width = b
    }
};
jNode.prototype.getPathToRoot = function (c) {
    var a = new Array();
    var b = this;
    a.push(b.getText());
    while (b = b.parent) {
        if (c != null && c-- == 0) {
            break
        }
        a.push(b.getText())
    }
    return a
};
jNode.prototype.getPathToRootText = function (c, b) {
    var a = this.getPathToRoot(c);
    return a.join(b)
};
jNode.prototype.getDepth = function () {
    var b = 0;
    var a = this;
    while (a = a.parent) {
        b++
    }
    return b
};
jNode.prototype.focus = function (a) {
    var c = jMap.getSelecteds();
    if (a) {
        for (var b = c.length - 1; b >= 0; b--) {
            c[b].blur()
        }
    }
    if (!c.contains(this)) {
        c.push(this);
        this.body.animate({
            stroke: NODE_SELECTED_COLOR,
            "stroke-width": 3
        }, 300)
    }
    jMap.fireActionListener(ACTIONS.ACTION_NODE_SELECTED, this);
    jMap.work.focus()
};
jNode.prototype.blur = function () {
    var a = jMap.getSelecteds();
    if (a.contains(this)) {
        a.remove(this);
        this.body.animate({
            fill: this.background_color,
            stroke: this.edge.color,
            "stroke-width": this.stroke_width
        }, 300)
    }
};
jNode.prototype.screenFocus = function () {
    var a = jMap.work;
    a.scrollLeft = Math.round(this.getLocation().x - a.offsetWidth / 2 + this.getSize().width / 2);
    a.scrollTop = Math.round(this.getLocation().y - a.offsetHeight / 2 + this.getSize().height / 2)
};
jNode.prototype.setNote = function (a) {
    this.note = a
};
jNode.prototype.setFolding = function (f) {
    var b = (this.numofchildren > 0 || this.getChildren().length > 0);
    if (!b || this.isRootNode()) {
        return
    }
    var d = jMap.historyManager;
    var a = d && d.extractNode(this);
    this.setFoldingExecute(f);
    var c = d && d.extractNode(this);
    d && d.addToHistory(a, c);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_FOLDING, this);
    jMap.setSaved(false)
};
jNode.prototype.setFoldingExecute = function (b) {
    var a = (this.numofchildren > 0 || this.getChildren().length > 0);
    if (!a || this.isRootNode()) {
        return
    }
    if (b) {
        this.hideChildren(this);
        this.folderShape && this.folderShape.show();
        this.folded = true
    } else {
        this.showChildren(this);
        this.folderShape && this.folderShape.hide();
        this.folded = false
    }
};
jNode.prototype.setFoldingAll = function (c) {
    this.__FoldingAll(c, this);
    if (this.isRootNode()) {
        var b = this.getChildren();
        for (var a = 0; a < b.length; a++) {
            b[a].setFoldingExecute(c)
        }
    } else {
        this.setFoldingExecute(c)
    }
};
jNode.prototype.__FoldingAll = function (d, c) {
    if (!c.getChildren().isEmpty() && !c.isRootNode()) {
        c.folded = d
    }
    if (c.getChildren().length > 0) {
        var b = c.getChildren();
        for (var a = 0; a < b.length; a++) {
            this.__FoldingAll(d, b[a])
        }
    }
};
jNode.prototype.hideChildren = function (c) {
    if (c.getChildren().length > 0) {
        var b = c.getChildren();
        for (var a = 0; a < b.length; a++) {
            this.hideChildren(b[a]);
            b[a].hide()
        }
    }
};
jNode.prototype.hide = function () {
    this.body.hide();
    this.text.hide();
    this.folderShape && this.folderShape.hide();
    this.img && this.img.hide();
    this.hyperlink && this.hyperlink.hide();
    this.connection && this.connection.hide();
    if (this.foreignObjEl) {
        this.foreignObjEl.style.display = "none"
    }
    for (var a = 0; a < this.arrowlinks.length; a++) {
        this.arrowlinks[a].hide()
    }
    var b = jMap.getArrowLinks(this);
    for (var a = 0; a < b.length; a++) {
        b[a].hide()
    }
    this.hided = true
};
jNode.prototype.showChildren = function (c) {
    if (c.getChildren().length > 0) {
        var b = c.getChildren();
        for (var a = 0; a < b.length; a++) {
            b[a].show();
            if (!b[a].folded) {
                this.showChildren(b[a])
            }
        }
    }
};
jNode.prototype.show = function () {
    this.body.show();
    this.text.show();
    this.folded && this.folderShape.show();
    this.img && this.img.show();
    this.hyperlink && this.hyperlink.show();
    this.connection && this.connection.show();
    if (this.foreignObjEl) {
        this.foreignObjEl.style.display = "block"
    }
    for (var a = 0; a < this.arrowlinks.length; a++) {
        this.arrowlinks[a].show()
    }
    var b = jMap.getArrowLinks(this);
    for (var a = 0; a < b.length; a++) {
        b[a].show()
    }
    this.hided = false
};
jNode.prototype.hadChildren = function (c) {
    if (this.getChildren().length > 0) {
        var b = this.getChildren();
        for (var a = 0; a < b.length; a++) {
            if (c == b[a]) {
                return true
            }
            if (b[a].hadChildren(c)) {
                return true
            }
        }
    }
    return false
};
jNode.prototype.remove = function (c) {
    if (this.removed) {
        return false
    }
    if (!c && this.isRootNode()) {
        return false
    }
    jMap.saveAction.deleteAction(this);
    var d = jMap.historyManager;
    var a = d && d.extractNode(this, true);
    this.removeExecute(c);
    var b = null;
    d && d.addToHistory(a, b);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_REMOVE, this);
    jMap.setSaved(false)
};
jNode.prototype.removeExecute = function (d) {
    if (this.removed) {
        return false
    }
    if (!d && this.isRootNode()) {
        return false
    }
    if (!this.getChildren().isEmpty()) {
        var b = this.getChildren();
        for (var a = b.length - 1; a >= 0; a--) {
            b[a].removeExecute()
        }
    }
    jMap.deleteNodeById(this.id);
    this.connection && this.connection.remove();
    while (this.arrowlinks.length != 0) {
        this.removeArrowLink(this.arrowlinks[0])
    }
    var c = jMap.getArrowLinks(this);
    for (var a = 0; a < c.length; a++) {
        this.removeArrowLink(c[a])
    }
    for (e in this) {
        if (this[e] && this[e].toString) {
            if (this[e].toString() == "Rapha\xebl\u2019s object") {
                this[e].remove()
            }
        }
    }
    this.groupEl.parentNode.removeChild(this.groupEl);
    this.parent && this.parent.getChildren().remove(this);
    this.removed = true;
    return true
};
jNode.prototype.clone = function () {
    var a = new jRect();
    for (e in this) {
        if (this[e] && this[e].toString) {
            if (this[e].toString() == "Rapha\xebl\u2019s object") {
                a[e] = this[e].clone()
            }
        }
    }
    return a
};
jNode.prototype.nextSibling = function (f) {
    if (this.isRootNode()) {
        return null
    }
    var b = this.getIndexPos();
    var d = this.getParent().getChildren();
    var h = d.length - 1;
    if (jMap.layoutManager.type == "jMindMapLayout") {
        if (this.getParent().isRootNode()) {
            var a = this.position;
            for (var c = b; c < h; c++) {
                if (d[c + 1].position == a) {
                    return d[c + 1]
                }
            }
            return null
        }
    }
    if (f && b == h && this.getParent().nextSibling(f)) {
        var g = this.getParent().nextSibling(f).getChildren();
        if (g.length > 0) {
            return g[0]
        }
    }
    if (b < h) {
        return d[b + 1]
    }
    return null
};
jNode.prototype.prevSibling = function (f) {
    if (this.isRootNode()) {
        return null
    }
    var b = this.getIndexPos();
    var d = this.getParent().getChildren();
    if (jMap.layoutManager.type == "jMindMapLayout") {
        if (this.getParent().isRootNode()) {
            var a = this.position;
            for (var c = b; c > 0; c--) {
                if (d[c - 1].position == a) {
                    return d[c - 1]
                }
            }
            return null
        }
    }
    if (f && b == 0 && this.getParent().prevSibling(f)) {
        var g = this.getParent().prevSibling(f).getChildren();
        if (g.length > 0) {
            return g[g.length - 1]
        }
    }
    if (b > 0) {
        return d[b - 1]
    }
    return null
};
jNode.prototype.addEventController = function (a) {
    this.mousedown(a.mousedown);
    this.mouseup(a.mouseup);
    this.mousemove(a.mousemove);
    this.mouseover(a.mouseover);
    this.mouseout(a.mouseout);
    this.click(a.click);
    this.dblclick(a.dblclick);
    this.dragstart(a.dragstart);
    this.dragenter(a.dragenter);
    this.dragexit(a.dragexit);
    this.drop(a.drop)
};
jNode.prototype.removeEventController = function (a) {
    this.unmousedown(a.mousedown);
    this.unmouseup(a.mouseup);
    this.unmousemove(a.mousemove);
    this.unmouseover(a.mouseover);
    this.unmouseout(a.mouseout);
    this.unclick(a.click);
    this.undblclick(a.dblclick);
    this.undragstart(a.dragstart);
    this.undragenter(a.dragenter);
    this.undragexit(a.dragexit);
    this.undrop(a.drop)
};
var drag = [],
    dragMove = function (f) {
        var h = f.clientX,
            g = f.clientY,
            k = document.documentElement.scrollTop || document.body.scrollTop,
            l = document.documentElement.scrollLeft || document.body.scrollLeft,
            a, b = drag.length;
        while (b--) {
            a = drag[b];
            if (supportsTouch) {
                var d = f.touches.length,
                    c;
                while (d--) {
                    c = f.touches[d];
                    if (c.identifier == a.el._drag.id) {
                        h = c.clientX;
                        g = c.clientY;
                        (f.originalEvent ? f.originalEvent : f).preventDefault();
                        break
                    }
                }
            } else {
                f.preventDefault()
            }
            h += l;
            g += k;
            a.move && a.move.call(a.el, h - a.el._drag.x, g - a.el._drag.y, h, g)
        }
    }, dragUp = function (f) {
        Raphael.unmousemove(dragMove).unmouseup(dragUp);
        var h = f.clientX,
            g = f.clientY,
            k = document.documentElement.scrollTop || document.body.scrollTop,
            l = document.documentElement.scrollLeft || document.body.scrollLeft,
            b = drag.length,
            a;
        while (b--) {
            a = drag[b];
            if (supportsTouch) {
                var d = f.touches.length,
                    c;
                while (d--) {
                    c = f.touches[d];
                    if (c.identifier == a.el._drag.id) {
                        h = c.clientX;
                        g = c.clientY;
                        (f.originalEvent ? f.originalEvent : f).preventDefault();
                        break
                    }
                }
            } else {
                f.preventDefault()
            }
            h += l;
            g += k;
            a.end && a.end.call(a.el, h - a.el._drag.x, g - a.el._drag.y, h, g);
            a.el._drag = {}
        }
        drag = []
    };
jNode.prototype.drag = function (a, c, b) {
    this._drag = {};
    this.mousedown(function (f) {
        (f.originalEvent || f).preventDefault();
        var d = document.documentElement.scrollTop || document.body.scrollTop,
            g = document.documentElement.scrollLeft || document.body.scrollLeft;
        this._drag.x = f.clientX + g;
        this._drag.y = f.clientY + d;
        this._drag.id = f.identifier;
        c && c.call(this, f.clientX + g, f.clientY + d);
        !drag.length && Raphael.mousemove(dragMove).mouseup(dragUp);
        drag.push({
            el: this,
            move: a,
            end: b
        })
    });
    return this
};
jNode.prototype.undrag = function (a, d, c) {
    var b = drag.length;
    while (b--) {
        drag[b].el == this && (drag[b].move == a && drag[b].end == c) && drag.splice(b, 1);
        !drag.length && R.unmousemove(dragMove).unmouseup(dragUp)
    }
};
jNode.prototype.toString = function () {
    return "jNode"
};
jNode.prototype.initCreate = function () {};
jNode.prototype.initElements = function () {};
jNode.prototype.create = function () {};
jNode.prototype.translate = function (a, b) {};
jNode.prototype.getSize = function () {};
jNode.prototype.setSize = function (b, a) {};
jNode.prototype.getLocation = function () {};
jNode.prototype.setLocation = function (a, b) {};
jNode.prototype.CalcBodySize = function () {};
jNode.prototype.updateNodeShapesPos = function () {};
jNode.prototype.getInputPort = function () {};
jNode.prototype.getOutputPort = function () {};
jNode.prototype.toXML = function () {};
jMindMapNode = function (b, d, f, c, a) {
    this.index = c;
    this.position = (a) ? a : "";
    this.link = "";
    this.style = "";
    this.created = 0;
    this.modified = 0;
    this.hgap = 0;
    this.vgap = 0;
    this.vshift = 0;
    this.SHIFT = -2;
    this.relYPos = 0;
    this.treeWidth = 0;
    this.treeHeight = 0;
    this.leftTreeWidth = 0;
    this.rightTreeWidth = 0;
    this.upperChildShift = 0;
    jMindMapNode.superclass.call(this, b, d, f);
    this.folderShape && this.folderShape.hide()
};
extend(jMindMapNode, jNode);
jMindMapNode.prototype.type = "jMindMapNode";
jMindMapNode.prototype.initCreate = function () {
    if (this.getParent()) {
        if (this.index != null) {
            this.getParent().insertChild(this, this.index)
        } else {
            this.getParent().appendChild(this)
        } if (this.getParent().isRootNode() && this.position) {
            this.position = this.position
        } else {
            if (this.getParent().isRootNode()) {
                var b = this.getParent().getChildren();
                var c = 0;
                var d = 0;
                for (var a = 0; a < b.length; a++) {
                    (b[a].position == "left") && c++;
                    (b[a].position == "right") && d++
                }
                if (c < d) {
                    this.position = "left"
                } else {
                    this.position = "right"
                }
            } else {
                this.position = ""
            }
        }
    }
};
jMindMapNode.prototype.translate = function (a, b) {
    this.body.translate(a, b);
    this.text.translate(a, b);
    this.folderShape && this.folderShape.translate(a, b);
    this.img && this.img.translate(a, b);
    this.hyperlink && this.hyperlink.translate(a, b);
    this.connection && this.connection.updateLine()
};
jMindMapNode.prototype.relativeCoordinate = function (d, b) {
    var f = jMap.historyManager;
    var a = f && f.extractNode(this);
    this.relativeCoordinateExecute(d, b);
    var c = f && f.extractNode(this);
    f && f.addToHistory(a, c);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_COORDMOVED, this, d, b);
    jMap.setSaved(false)
};
jMindMapNode.prototype.relativeCoordinateExecute = function (b, a) {
    switch (jMap.layoutManager.type) {
    case "jMindMapLayout":
        if (this.isLeft()) {
            b = -b
        }
        this.hgap = parseInt(this.hgap) + b;
        this.vshift = parseInt(this.vshift) + a;
        break;
    case "jTreeLayout":
        this.hgap = parseInt(this.hgap) + a;
        this.vshift = parseInt(this.vshift) + b;
        break;
    default:
    }
    if (isNaN(this.hgap)) {
        this.hgap = 0
    }
    if (isNaN(this.vshift)) {
        this.vshift = 0
    }
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(this);
    jMap.layoutManager.layout(true)
};
jMindMapNode.prototype.isLeft = function () {
    if (this.position && this.position != "") {
        return (this.position == "left") ? true : false
    } else {
        if ((this.position == null || this.position == "") && this.parent != null) {
            return this.parent.isLeft()
        } else {
            return false
        }
    }
};
jMindMapNode.prototype.setHyperlink = function (c) {
    var d = jMap.historyManager;
    var a = d && d.extractNode(this);
    this.setHyperlinkExecute(c);
    var b = d && d.extractNode(this);
    d && d.addToHistory(a, b);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_HYPER, this);
    jMap.setSaved(false)
};
jMindMapNode.prototype.setHyperlinkExecute = function (b) {
    if (b == null || b == "") {
        if (this.hyperlink) {
            var a = this.hyperlink.node.parentNode;
            var c = this.hyperlink.node.parentNode.parentNode;
            c.removeChild(a);
            this.hyperlink.remove();
            this.hyperlink = null;
            this.CalcBodySize()
        }
        return
    }
    if (!this.hyperlink) {
        this.hyperlink = RAPHAEL.image("/images/hyperlink.png", 0, 0, 12, 10);
        if (Raphael.svg) {
            this.groupEl.appendChild(this.hyperlink.node)
        }
        if (Raphael.vml) {
            this.groupEl.appendChild(this.hyperlink.Group)
        }
        this.hyperlink.attr({
            cursor: "auto"
        })
    }
    this.hyperlink.attr({
        href: b,
        target: "blank"
    });
    this.CalcBodySize()
};
jMindMapNode.prototype.setImage = function (b) {
    var c = jMap.historyManager;
    var a = c && c.extractNode(this);
    this.setImageExecute(b, function () {
        var d = c && c.extractNode(this);
        c && c.addToHistory(a, d);
        jMap.saveAction.editAction(this);
        jMap.fireActionListener(ACTIONS.ACTION_NODE_IMAGE, this.id, b);
        jMap.setSaved(false)
    })
};
jMindMapNode.prototype.setImageExecute = function (b, a) {
    if (b == null || b == "") {
        if (this.img) {
            this.img.remove();
            this.img = null;
            this.CalcBodySize();
            a && a.call(this)
        }
        return false
    }
    var d = new Image();
    var c = this;
    d.onload = function () {
        if (c.img) {
            c.img.attr({
                src: b
            })
        } else {
            c.img = RAPHAEL.image(b, 0, 0, this.width, this.height);
            if (Raphael.svg) {
                c.groupEl.appendChild(c.img.node)
            }
            if (Raphael.vml) {
                c.groupEl.appendChild(c.img.Group)
            }
        }
        c.getParent() && c.getParent().folded && c.img.hide();
        c.CalcBodySize();
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
        a && a.call(c);
        return true
    };
    d.src = b
};
jMindMapNode.prototype.setForeignObject = function (d, f, a) {
    var g = jMap.historyManager;
    var b = g && g.extractNode(this);
    this.setForeignObjectExecute(d, f, a);
    var c = g && g.extractNode(this);
    g && g.addToHistory(b, c);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_FOREIGNOBJECT, this, d, f, a);
    jMap.setSaved(false)
};
jMindMapNode.prototype.setForeignObjectExecute = function (b, c, a) {
    if (!Raphael.svg) {
        return false
    }
    if (!this.foreignObjEl) {
        this.foreignObjEl = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        this.foreignObjEl.bodyEl = document.createElementNS("http://www.w3.org/1999/xhtml", "body");
        this.foreignObjEl.appendChild(this.foreignObjEl.bodyEl);
        this.groupEl.appendChild(this.foreignObjEl);
        this.foreignObjEl.setAttribute("x", this.body.getBBox().x);
        this.foreignObjEl.setAttribute("y", this.body.getBBox().y)
    }
    c && this.foreignObjEl.setAttribute("width", c);
    a && this.foreignObjEl.setAttribute("height", a);
    this.foreignObjEl.bodyEl.innerHTML = b;
    this.foreignObjEl.plainHtml = b;
    this.CalcBodySize()
};
jMindMapNode.prototype.fix_flash = function (b) {
    var a = b.getElementsByTagName("embed");
    for (i = 0; i < a.length; i++) {
        embed = a[i];
        var k;
        if (embed.outerHTML) {
            var g = embed.outerHTML;
            if (g.match(/wmode\s*=\s*('|")[a-zA-Z]+('|")/i)) {
                k = g.replace(/wmode\s*=\s*('|")window('|")/i, "wmode='transparent'")
            } else {
                k = g.replace(/<embed\s/i, "<embed wmode='transparent' ")
            }
            embed.insertAdjacentHTML("beforeBegin", k);
            embed.parentNode.removeChild(embed)
        } else {
            k = embed.cloneNode(true);
            if (!k.getAttribute("wmode") || k.getAttribute("wmode").toLowerCase() == "window") {
                k.setAttribute("wmode", "transparent")
            }
            embed.parentNode.replaceChild(k, embed)
        }
    }
    var l = b.getElementsByTagName("object");
    for (i = 0; i < l.length; i++) {
        object = l[i];
        var f;
        if (object.outerHTML) {
            var g = object.outerHTML;
            if (g.match(/<param\s+name\s*=\s*('|")wmode('|")\s+value\s*=\s*('|")[a-zA-Z]+('|")\s*\/?\>/i)) {
                f = g.replace(/<param\s+name\s*=\s*('|")wmode('|")\s+value\s*=\s*('|")window('|")\s*\/?\>/i, "<param name='wmode' value='transparent' />")
            } else {
                f = g.replace(/<\/object\>/i, "<param name='wmode' value='transparent' />\n</object>")
            }
            var c = object.childNodes;
            for (j = 0; j < c.length; j++) {
                try {
                    if (c[j] != null) {
                        var h = c[j].getAttribute("name");
                        if (h != null && h.match(/flashvars/i)) {
                            f = f.replace(/<param\s+name\s*=\s*('|")flashvars('|")\s+value\s*=\s*('|")[^'"]*('|")\s*\/?\>/i, "<param name='flashvars' value='" + c[j].getAttribute("value") + "' />")
                        }
                    }
                } catch (d) {}
            }
            object.insertAdjacentHTML("beforeBegin", f);
            object.parentNode.removeChild(object)
        }
    }
};
jMindMapNode.prototype.setYoutubeVideo = function (b) {
    var a = '<object width="300" height="300"><param name="movie" value="' + b + '"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="' + b + '" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="300" height="300"></embed></object>';
    this.setHyperlink(b);
    this.setForeignObject(a, 300, 300)
};
jMindMapNode.prototype.getShift = function () {
    try {
        if (this.getParent().getChildren().length == 0) {
            var a = parseInt(this.vshift) + parseInt(this.SHIFT);
            if (isNaN(a)) {
                a = 0
            }
            return a
        } else {
            return this.vshift
        }
    } catch (b) {
        return 0
    }
};
jMindMapNode.prototype.getLeftChildren = function () {
    var b = this.getChildren();
    var d = new Array();
    for (var a = 0; a < b.length; a++) {
        var c = b[a];
        if (c == null) {
            continue
        }
        if (c.isLeft()) {
            d.push(c)
        }
    }
    return d
};
jMindMapNode.prototype.getRightChildren = function () {
    var c = this.getChildren();
    var b = new Array();
    for (var a = 0; a < c.length; a++) {
        var d = c[a];
        if (d == null) {
            continue
        }
        if (!d.isLeft()) {
            b.push(d)
        }
    }
    return b
};
jMindMapNode.prototype.setRootTreeWidths = function (b, a) {
    this.leftTreeWidth = b - this.getSize().width;
    this.rightTreeWidth = a;
    this.setTreeWidth(this.leftTreeWidth + this.rightTreeWidth)
};
jMindMapNode.prototype.setTreeWidth = function (a) {
    this.treeWidth = a
};
jMindMapNode.prototype.getTreeWidth = function () {
    return this.treeWidth
};
jMindMapNode.prototype.setRootTreeHeights = function (b, a) {
    if (b > a) {
        this.setTreeHeight(b)
    } else {
        this.setTreeHeight(a)
    }
};
jMindMapNode.prototype.setTreeHeight = function (a) {
    this.treeHeight = a
};
jMindMapNode.prototype.getTreeHeight = function () {
    return this.treeHeight
};
jMindMapNode.prototype.getUpperChildShift = function () {
    return this.upperChildShift
};
jMindMapNode.prototype.setRootUpperChildShift = function (b, a) {
    this.setUpperChildShift(Math.max(b, a))
};
jMindMapNode.prototype.setUpperChildShift = function (a) {
    this.upperChildShift = a
};
jMindMapNode.prototype.isFoldingHit = function (b) {
    var d = false;
    switch (jMap.layoutManager.type) {
    case "jMindMapLayout":
        var a = (b.offsetX) ? b.offsetX : b.layerX - this.getLocation().x;
        d = (this.isLeft()) ? (a < PERCEIVE_WIDTH) : (a > this.body.getBBox().width - PERCEIVE_WIDTH);
        break;
    case "jTreeLayout":
        var c = (b.offsetY) ? b.offsetY : b.layerY - this.getLocation().y;
        d = (c > this.body.getBBox().height - PERCEIVE_WIDTH);
        break;
    default:
    }
    return d
};
jMindMapNode.prototype.toXML = function () {
    var g = new StringBuffer();
    var h = false;
    if (this.img != null || (this.text.attrs.text != null && this.text.attrs.text.indexOf("\n") != -1)) {
        h = true
    }
    var f = new StringBuffer();
    f.add("<node");
    f.add('CREATED="' + this.created + '"');
    f.add('ID="' + this.id + '"');
    f.add('MODIFIED="' + this.modified + '"');
    if (!h) {
        f.add('TEXT="' + convertCharStr2SelectiveCPs(convertCharStr2XML(this.text.attrs.text, true, true), "ascii", true, "&#x", ";", "hex") + '"')
    }
    f.add('FOLDED="' + this.folded + '"');
    if (this.background_color != "") {
        f.add('BACKGROUND_COLOR="' + this.background_color + '"')
    }
    if (this.color != "") {
        f.add('COLOR="' + this.color + '"')
    }
    if (this.hyperlink != null) {
        f.add('LINK="' + convertCharStr2XML(this.hyperlink.attr().href) + '"')
    }
    if (this.position != "" && this.position != "undefined") {
        f.add('POSITION="' + this.position + '"')
    }
    if (this.style != "") {
        f.add('STYLE="' + this.style + '"')
    }
    if (this.hgap != 0) {
        f.add('HGAP="' + this.hgap + '"')
    }
    if (this.vgap != 0) {
        f.add('VGAP="' + this.vgap + '"')
    }
    if (this.vshift != 0) {
        f.add('VSHIFT="' + this.vshift + '"')
    }
    if (this.numofchildren != null) {
        f.add('NUMOFCHILDREN="' + this.numofchildren + '"')
    }
    f.add(">");
    g.add(f.toString(" "));
    if (h) {
        var a = new StringBuffer();
        a.add('<richcontent TYPE="NODE"><html>\n');
        a.add("  <head>\n");
        a.add("\n");
        a.add("  </head>\n");
        a.add("  <body>\n");
        if (this.img != null) {
            a.add("    <p>\n");
            a.add('      <img src="' + this.img.attr().src + '" />\n');
            a.add("    </p>\n")
        }
        if (this.text.attrs.text != null) {
            var l = JinoUtil.trimStr(this.text.attrs.text).split("\n");
            for (var k = 0; k < l.length; k++) {
                a.add("<p>" + convertCharStr2SelectiveCPs(convertCharStr2XML(l[k], true, true), "ascii", true, "&#x", ";", "hex") + "</p>\n")
            }
        }
        a.add("  </body>\n");
        a.add("</html>\n");
        a.add("</richcontent>");
        g.add(a.toString(" "))
    }
    if (this.arrowlinks.length > 0) {
        for (var k = 0; k < this.arrowlinks.length; k++) {
            g.add(this.arrowlinks[k].toXML())
        }
    }
    if (this.foreignObjEl) {
        var b = new StringBuffer();
        b.add('<foreignObject WIDTH="' + this.foreignObjEl.getAttribute("width") + '" HEIGHT="' + this.foreignObjEl.getAttribute("height") + '">');
        b.add(this.foreignObjEl.plainHtml);
        b.add("</foreignObject>");
        g.add(b.toString(" "))
    }
    var c = new StringBuffer();
    c.add("<info");
    if (this.lazycomplete) {
        c.add('LAZYCOMPLETE="' + this.lazycomplete + '"')
    }
    c.add("/>");
    g.add(c.toString(" "));
    var d = this.getChildren();
    if (d.length > 0) {
        for (var k = 0; k < d.length; k++) {
            g.add(d[k].toXML())
        }
    }
    g.add("</node>");
    return g.toString("\n")
};
jMindMapNode.prototype.toString = function () {
    return "jMindMapNode"
};
jMindMapNode.prototype.initElements = function () {};
jMindMapNode.prototype.create = function () {};
jMindMapNode.prototype.getSize = function () {};
jMindMapNode.prototype.setSize = function (b, a) {};
jMindMapNode.prototype.getLocation = function () {};
jMindMapNode.prototype.setLocation = function (a, b) {};
jMindMapNode.prototype.CalcBodySize = function () {};
jMindMapNode.prototype.updateNodeShapesPos = function () {};
jMindMapNode.prototype.getInputPort = function () {};
jMindMapNode.prototype.getOutputPort = function () {};
jRect = function (b, d, f, c, a) {
    jRect.superclass.call(this, b, d, f, c, a)
};
extend(jRect, jMindMapNode);
jRect.prototype.type = "jRect";
jRect.prototype.initElements = function () {
    this.body = RAPHAEL.rect();
    this.text = RAPHAEL.text();
    this.folderShape = RAPHAEL.circle(0, 0, FOLDER_RADIUS);
    this.wrapElements(this.body, this.text, this.folderShape)
};
jRect.prototype.create = function () {
    this.connection = null;
    switch (jMap.layoutManager.type) {
    case "jMindMapLayout":
        this.connection = this.parent && new jLineBezier(this.parent, this);
        break;
    case "jTreeLayout":
        this.connection = this.parent && new jLinePolygonal(this.parent, this);
        break;
    default:
    }
    var b = this.body;
    var h = this.text;
    var g = this.folderShape;
    b.attr({
        r: NODE_CORNER_ROUND,
        rx: NODE_CORNER_ROUND,
        ry: NODE_CORNER_ROUND
    });
    if (this.getParent()) {
        var d = this.getParent().getLocation();
        this.setLocation(d.x, d.y)
    }
    this.setBackgroundColorExecute(NODE_DEFALUT_COLOR);
    this.setEdgeColorExecute(EDGE_DEFALUT_COLOR, 1);
    var c = 400;
    var a = "Arial, Gulim, 굴림";
    var f = "#000";
    if (!this.getParent()) {
        this.fontSize = NODE_FONT_SIZE_ENUM[0];
        c = "700"
    } else {
        if (this.getParent() && this.getParent().isRootNode()) {
            this.fontSize = NODE_FONT_SIZE_ENUM[1];
            c = "700"
        } else {
            this.fontSize = NODE_FONT_SIZE_ENUM[2];
            c = "400"
        }
    } if (this.isRootNode()) {
        h.attr({
            "font-family": a,
            "font-size": this.fontSize,
            "font-weight": c,
            fill: f
        })
    } else {
        h.attr({
            "font-family": a,
            "font-size": this.fontSize,
            "font-weight": c,
            "text-anchor": "start",
            fill: f
        })
    }
    this.setTextExecute(this.plainText)
};
jRect.prototype.getSize = function () {
    return {
        width: this.body.getBBox().width,
        height: this.body.getBBox().height
    }
};
jRect.prototype.setSize = function (b, a) {
    this.body.attr({
        width: b,
        height: a
    })
};
jRect.prototype.getLocation = function () {
    return {
        x: this.body.getBBox().x,
        y: this.body.getBBox().y
    }
};
jRect.prototype.setLocation = function (b, c) {
    var a = this.body;
    if (b && !c) {
        a.attr({
            x: b
        })
    } else {
        if (!b && c) {
            a.attr({
                y: c
            })
        } else {
            a.attr({
                x: b,
                y: c
            })
        }
    }
    this.updateNodeShapesPos()
};
jRect.prototype.CalcBodySize = function () {
    var f = 0;
    var a = 0;
    var b = TEXT_HGAP;
    var d = TEXT_VGAP;
    var h = false;
    if (this.getText() == "") {
        this.text.attr({
            text: "_"
        });
        var h = true
    }
    f += this.text.getBBox().width;
    a += this.text.getBBox().height;
    if (h) {
        this.text.attr({
            text: ""
        })
    }
    if (this.img) {
        f = (f < this.img.getBBox().width) ? this.img.getBBox().width : f;
        a += this.img.getBBox().height
    }
    if (this.foreignObjEl) {
        var c = parseInt(this.foreignObjEl.getAttribute("width"));
        var g = parseInt(this.foreignObjEl.getAttribute("height"));
        f = (f < c) ? c : f;
        a += g
    }
    if (this.hyperlink) {
        f += this.hyperlink.getBBox().width + b / 2
    }
    this.setSize(f + b, a + d);
    this.updateNodeShapesPos()
};
jRect.prototype.updateNodeShapesPos = function () {
    var l = TEXT_HGAP;
    var q = TEXT_VGAP;
    var m = 0;
    var p = this.body;
    var s = this.text;
    var f = this.folderShape;
    var A = this.img;
    var g = this.hyperlink;
    var c = this.foreignObjEl;
    var o = p.getBBox().x;
    var n = p.getBBox().y;
    var b = 0;
    var a = 0;
    switch (jMap.layoutManager.type) {
    case "jMindMapLayout":
        b = this.isLeft() ? o : o + this.body.getBBox().width;
        a = n + this.body.getBBox().height / 2;
        break;
    case "jTreeLayout":
        b = o + this.body.getBBox().width / 2;
        a = n + this.body.getBBox().height;
        break;
    default:
    }
    this.folderShape.attr({
        cx: b,
        cy: a
    });
    if (A) {
        var z = o + l / 2;
        var w = n + q / 2;
        if (this.isRootNode()) {
            z += (p.getBBox().width / 2) - (A.getBBox().width / 2) - l / 2
        }
        A.attr({
            x: z,
            y: w
        });
        m += A.getBBox().height
    }
    if (c) {
        var t = o + l / 2;
        var r = n + m + q / 2;
        m += parseInt(c.getAttribute("height"));
        c.setAttribute("x", t);
        c.setAttribute("y", r)
    }
    if (s) {
        var k = o + l / 2;
        var h = n + (q + s.getBBox().height) / 2;
        if (this.isRootNode()) {
            k += p.getBBox().width / 2 - l / 2
        }
        h += m;
        s.attr({
            x: k,
            y: h
        })
    }
    if (g) {
        var v = o + l;
        var d = s.getBBox().width;
        if (A) {
            v += (d > A.getBBox().width) ? d : A.getBBox().width
        } else {
            v += d
        }
        var u = n + s.getBBox().height / 2;
        u += A && A.getBBox().height / 2;
        g && g.attr({
            x: v,
            y: u
        })
    }
    this.connection && this.connection.updateLine()
};
jRect.prototype.getInputPort = function () {
    var a = this.body.getBBox();
    var b = 0;
    var c = 0;
    if (isFinite(a.width) && !isNaN(a.width)) {
        b = a.width
    }
    if (isFinite(a.height) && !isNaN(a.height)) {
        c = a.height
    }
    switch (jMap.layoutManager.type) {
    case "jMindMapLayout":
        if (this.isRootNode()) {
            return {
                x: a.x + b / 2,
                y: a.y + c / 2
            }
        }
        if (this.isLeft()) {
            return {
                x: a.x + b + 1,
                y: a.y + c / 2
            }
        } else {
            return {
                x: a.x - 1,
                y: a.y + c / 2
            }
        }
        break;
    case "jTreeLayout":
        if (this.isRootNode()) {
            return {
                x: a.x + b / 2,
                y: a.y + c
            }
        }
        return {
            x: a.x + b / 2,
            y: a.y
        };
        break;
    case "jRotateLayout":
        if (this.isRootNode()) {
            return {
                x: a.x + b / 2,
                y: a.y + c / 2
            }
        }
        if (this.isLeft()) {
            return {
                x: a.x - 1,
                y: a.y + c / 2
            }
        } else {
            return {
                x: a.x - 1,
                y: a.y + c / 2
            }
        }
        break;
    case "jTableLayout":
        if (this.isRootNode()) {
            return {
                x: a.x + b / 2,
                y: a.y + c
            }
        }
        return {
            x: a.x + b / 2,
            y: a.y
        };
        break;
    default:
    }
};
jRect.prototype.getOutputPort = function () {
    var a = this.body.getBBox();
    var b = 0;
    var c = 0;
    if (isFinite(a.width) && !isNaN(a.width)) {
        b = a.width
    }
    if (isFinite(a.height) && !isNaN(a.height)) {
        c = a.height
    }
    switch (jMap.layoutManager.type) {
    case "jMindMapLayout":
        if (this.isRootNode()) {
            return {
                x: a.x + b / 2,
                y: a.y + c / 2
            }
        }
        if (this.isLeft()) {
            return {
                x: a.x - 1,
                y: a.y + c / 2
            }
        } else {
            return {
                x: a.x + b + 1,
                y: a.y + c / 2
            }
        }
        break;
    case "jTreeLayout":
        return {
            x: a.x + b / 2,
            y: a.y + c
        };
        break;
    case "jRotateLayout":
        if (this.isRootNode()) {
            return {
                x: a.x + b / 2,
                y: a.y + c / 2
            }
        }
        if (this.isLeft()) {
            return {
                x: a.x + b + 1,
                y: a.y + c / 2
            }
        } else {
            return {
                x: a.x + b + 1,
                y: a.y + c / 2
            }
        }
        break;
    case "jTableLayout":
        return {
            x: a.x + b / 2,
            y: a.y + c
        };
        break;
    default:
    }
};
jRect.prototype.toString = function () {
    return "jRect"
};
jEllipse = function (b, d, f, c, a) {
    jEllipse.superclass.call(this, b, d, f, c, a)
};
extend(jEllipse, jMindMapNode);
jEllipse.prototype.type = "jEllipse";
jEllipse.prototype.initElements = function () {
    this.body = RAPHAEL.ellipse();
    this.text = RAPHAEL.text();
    this.folderShape = RAPHAEL.circle(0, 0, FOLDER_RADIUS);
    this.wrapElements(this.body, this.text, this.folderShape)
};
jEllipse.prototype.create = function () {
    this.connection = this.parent && new jLineBezier(this.parent, this);
    var b = this.body;
    var g = this.text;
    var f = this.folderShape;
    this.setBackgroundColorExecute(NODE_DEFALUT_COLOR);
    this.setEdgeColorExecute(EDGE_DEFALUT_COLOR, 1);
    var c = 400;
    var a = "Arial, Gulim, 굴림";
    var d = "#000";
    if (!this.getParent()) {
        this.fontSize = NODE_FONT_SIZE_ENUM[0];
        c = "bold"
    } else {
        if (this.getParent() && this.getParent().isRootNode()) {
            this.fontSize = NODE_FONT_SIZE_ENUM[1];
            c = "bold"
        } else {
            this.fontSize = NODE_FONT_SIZE_ENUM[2];
            c = "normal"
        }
    } if (this.isRootNode()) {
        g.attr({
            "font-family": a,
            "font-size": this.fontSize,
            "font-weight": c,
            fill: d
        })
    } else {
        g.attr({
            "font-family": a,
            "font-size": this.fontSize,
            "font-weight": c,
            "text-anchor": "start",
            fill: d
        })
    }
    this.setTextExecute(this.plainText)
};
jEllipse.prototype.getSize = function () {
    return {
        width: this.body.getBBox().width,
        height: this.body.getBBox().height
    }
};
jEllipse.prototype.setSize = function (b, a) {
    this.body.attr({
        rx: b / 2,
        ry: a / 2
    })
};
jEllipse.prototype.getLocation = function () {
    return {
        x: this.body.getBBox().x,
        y: this.body.getBBox().y
    }
};
jEllipse.prototype.setLocation = function (b, c) {
    var a = this.body;
    a.attr({
        cx: b + this.body.getBBox().width / 2,
        cy: c + this.body.getBBox().height / 2
    });
    this.updateNodeShapesPos()
};
jEllipse.prototype.CalcBodySize = function () {
    var b = 0;
    var a = 0;
    var c = false;
    if (this.getText() == "") {
        this.text.attr({
            text: "_"
        });
        var c = true
    }
    b += this.text.getBBox().width;
    a += this.text.getBBox().height;
    if (c) {
        this.text.attr({
            text: ""
        })
    }
    if (this.img) {
        b = (b < this.img.getBBox().width) ? this.img.getBBox().width : b;
        a += this.img.getBBox().height
    }
    if (this.hyperlink) {
        b += this.hyperlink.getBBox().width + TEXT_HGAP / 2
    }
    this.setSize(b + TEXT_HGAP, a + TEXT_VGAP);
    this.updateNodeShapesPos()
};
jEllipse.prototype.updateNodeShapesPos = function () {
    var f = this.body;
    var o = this.text;
    var r = this.folderShape;
    var c = this.img;
    var l = this.hyperlink;
    var k = f.getBBox().x;
    var h = f.getBBox().y;
    var q = this.isLeft() ? k : k + this.body.getBBox().width;
    var n = h + this.body.getBBox().height / 2;
    this.folderShape.attr({
        cx: q,
        cy: n
    });
    var g = k + TEXT_HGAP / 2;
    var d = h + TEXT_VGAP / 2;
    c && c.attr({
        x: g,
        y: d
    });
    var b = k + TEXT_HGAP / 2;
    if (this.isRootNode()) {
        b += o.getBBox().width / 2
    }
    var a = h + (o.getBBox().height + TEXT_VGAP) / 2;
    a += c && c.getBBox().height;
    o.attr({
        x: b,
        y: a
    });
    var p = k + TEXT_HGAP;
    if (c) {
        p += (o.getBBox().width > c.getBBox().width) ? o.getBBox().width : c.getBBox().width
    } else {
        p += o.getBBox().width
    }
    var m = h + o.getBBox().height / 2;
    m += c && c.getBBox().height / 2;
    l && l.attr({
        x: p,
        y: m
    });
    this.connection && this.connection.updateLine()
};
jEllipse.prototype.getInputPort = function () {
    var a = this.body.getBBox();
    var b = 0;
    var c = 0;
    if (isFinite(a.width) && !isNaN(a.width)) {
        b = a.width
    }
    if (isFinite(a.height) && !isNaN(a.height)) {
        c = a.width
    }
    if (this.isLeft()) {
        return {
            x: a.x + b + 1,
            y: a.y + c / 2
        }
    } else {
        return {
            x: a.x - 1,
            y: a.y + c / 2
        }
    }
};
jEllipse.prototype.getOutputPort = function () {
    var a = this.body.getBBox();
    var b = 0;
    var c = 0;
    if (isFinite(a.width) && !isNaN(a.width)) {
        b = a.width
    }
    if (isFinite(a.height) && !isNaN(a.height)) {
        c = a.width
    }
    if (this.isLeft()) {
        return {
            x: a.x - 1,
            y: a.y + c / 2
        }
    } else {
        return {
            x: a.x + b + 1,
            y: a.y + c / 2
        }
    }
};
jEllipse.prototype.toString = function () {
    return "jEllipse"
};
jLine = function (c, a) {
    this.node1 = c;
    this.node2 = a;
    var b = "#000";
    this.line = RAPHAEL.path().attr({
        stroke: b,
        fill: "none"
    });
    if (jMap.groupEl) {
        jMap.groupEl.appendChild(this.line.node)
    }
    this.line.toBack();
    this.draw()
};
jLine.prototype.type = "jLine";
jLine.prototype.updateLine = function () {
    this.draw()
};
jLine.prototype.getWidth = function () {
    var a = parseInt(this.node2.edge.width);
    if (isNaN(a)) {
        a = 0
    }
    return a
};
jLine.prototype.getColor = function () {
    return this.node2.edge.color
};
jLine.prototype.show = function () {
    this.line.show()
};
jLine.prototype.hide = function () {
    this.line.hide()
};
jLine.prototype.remove = function () {
    this.line.remove()
};
jLine.prototype.draw = function () {};
jLineBezier = function (b, a) {
    jLineBezier.superclass.call(this, b, a)
};
extend(jLineBezier, jLine);
jLineBezier.prototype.type = "jLineBezier";
jLineBezier.prototype.draw = function () {
    var r = this.getWidth();
    if (!r) {
        r = 1
    }
    var g = this.node2.isLeft();
    var o = this.node1.body.getBBox();
    var n = this.node2.body.getBBox();
    var q = 0;
    if (isFinite(o.width)) {
        q = o.width
    }
    var a = 0;
    if (isFinite(n.width)) {
        a = n.width
    }
    var x = this.node2.getInputPort();
    var m = this.node1.getOutputPort();
    if (g) {
        var B = [2, 7];
        if (this.node1.isRootNode()) {
            m = this.node1.getInputPort()
        }
    } else {
        var B = [3, 6]
    }
    var w = m.x,
        f = m.y - r / 2,
        t = x.x,
        b = x.y,
        l = Math.max(Math.abs(w - t) / 2, 10),
        k = Math.max(Math.abs(f - b) / 2, 10),
        v = [w, w, w - l, w + l][B[0]].toFixed(3),
        d = [f - k, f + k, f, f][B[0]].toFixed(3),
        u = [0, 0, 0, 0, t, t, t - l, t + l][B[1]].toFixed(3),
        c = [0, 0, 0, 0, f + k, f - k, b, b][B[1]].toFixed(3),
        h = f + r,
        z = [0, 0, 0, 0, t, t, t - l, t + l][B[1]],
        A = [w, w, w - l, w + l][B[0]];
    if (g) {
        if (f > b) {
            z = z - r;
            A = A - r
        } else {
            z = z + r;
            A = A + r
        }
    } else {
        if (f > b) {
            z = z + r;
            A = A + r
        } else {
            z = z - r;
            A = A - r
        }
    }
    z = z.toFixed(3);
    A = A.toFixed(3);
    var p = ["M", w.toFixed(3), f.toFixed(3), "C", v, d, u, c, t.toFixed(3), b.toFixed(3), "C", u, c, A, d, w.toFixed(3), h.toFixed(3)].join(",");
    var s = this.getColor();
    this.line.attr({
        path: p,
        stroke: s,
        fill: s
    })
};
jLineStraight = function (b, a) {
    jLineStraight.superclass.call(this, b, a)
};
extend(jLineStraight, jLine);
jLineStraight.prototype.type = "jLineStraight";
jLineStraight.prototype.draw = function () {
    var d = this.getWidth();
    if (!d) {
        d = 1
    }
    var c = this.node1.body.getBBox();
    var a = this.node2.body.getBBox();
    var l = 0;
    if (isFinite(c.width)) {
        l = c.width
    }
    var g = 0;
    if (isFinite(a.width)) {
        g = a.width
    }
    var n = this.node2.getInputPort();
    var k = this.node1.getOutputPort();
    var f = k.x.toFixed(3),
        b = n.x.toFixed(3),
        o = k.y.toFixed(3),
        m = n.y.toFixed(3);
    var p = ["M", f, o, "L", b, m].join(",");
    var h = this.getColor();
    this.line.attr({
        path: p,
        stroke: h,
        fill: h
    })
};
jLinePolygonal = function (b, a) {
    jLinePolygonal.superclass.call(this, b, a)
};
extend(jLinePolygonal, jLine);
jLinePolygonal.prototype.type = "jLinePolygonal";
jLinePolygonal.prototype.draw = function () {
    var d = this.getWidth();
    if (!d) {
        d = 1
    }
    var c = this.node1.body.getBBox();
    var a = this.node2.body.getBBox();
    var l = 0;
    if (isFinite(c.width)) {
        l = c.width
    }
    var g = 0;
    if (isFinite(a.width)) {
        g = a.width
    }
    var o = this.node2.getInputPort();
    var k = this.node1.getOutputPort();
    var f = k.x.toFixed(0),
        b = o.x.toFixed(0),
        p = k.y.toFixed(0),
        n = o.y.toFixed(0);
    var m = parseInt(p) + 10;
    var q = ["M", f, p, "L", f, m, "L", b, m, "L", b, n, ].join(",");
    var h = this.getColor();
    this.line.attr({
        path: q,
        stroke: h
    })
};
ArrowLink = function (a) {
    this.startNode = null;
    this.color = null;
    this.destination = a ? a.id : null;
    this.destinationNode = a ? a : null;
    this.endArrow = "Default";
    this.endInclination = "129;0;";
    this.id = this.createID();
    this.startArrow = "None";
    this.startInclination = "129;0;";
    this.arrowWidth = 10;
    this.arrowHeight = 5;
    this.defaultColor = "#cc9";
    this.line = RAPHAEL.path().attr({
        stroke: this.color,
        fill: "none"
    });
    this.arrowEnd = RAPHAEL.path().attr({
        stroke: this.color,
        fill: this.defaultColor
    });
    this.arrowStart = RAPHAEL.path().attr({
        stroke: this.color,
        fill: this.defaultColor
    });
    this.hided = false
};
ArrowLink.prototype.type = "ArrowLink";
ArrowLink.prototype.remove = function () {
    if (this.removed) {
        return false
    }
    this.line.remove();
    this.arrowEnd.remove();
    this.arrowStart.remove();
    this.removed = true;
    return true
};
ArrowLink.prototype.hide = function () {
    this.line.hide();
    this.arrowEnd.hide();
    this.arrowStart.hide();
    this.hided = true
};
ArrowLink.prototype.show = function () {
    this.line.show();
    this.arrowEnd.show();
    this.arrowStart.show();
    this.hided = false
};
ArrowLink.prototype.getColor = function () {
    if (this.color != null) {
        return this.color
    } else {
        return this.defaultColor
    }
};
ArrowLink.prototype.createID = function () {
    var a = "";
    while (!jMap.checkID(a)) {
        a = "Arrow_ID_" + parseInt(Math.random() * 2000000000)
    }
    return a
};
ArrowLink.prototype.toXML = function () {
    var a = new StringBuffer();
    a.add("<arrowlink");
    a.add(' DESTINATION="' + this.destination + '"');
    if (this.color != null) {
        a.add('COLOR="' + this.color + '"')
    }
    if (this.endArrow != null) {
        a.add(' ENDARROW="' + this.endArrow + '"')
    }
    if (this.endInclination != null) {
        a.add(' ENDINCLINATION="' + this.endInclination + '"')
    }
    if (this.id != null) {
        a.add(' ID="' + this.id + '"')
    }
    if (this.startArrow != null) {
        a.add(' STARTARROW="' + this.startArrow + '"')
    }
    if (this.startInclination != null) {
        a.add(' STARTINCLINATION="' + this.startInclination + '"')
    }
    a.add("/>");
    return a.toString("\n")
};
ArrowLink.prototype.draw = function () {};
CurveArrowLink = function (a) {
    CurveArrowLink.superclass.call(this, a)
};
extend(CurveArrowLink, ArrowLink);
CurveArrowLink.prototype.type = "CurveArrowLink";
CurveArrowLink.prototype.draw = function () {
    if (this.removed) {
        return false
    }
    var n = jMap.getNodeById(this.destination);
    if (n == null || n.hided) {
        return false
    }
    var h = this.getColor();
    var b = this.startNode.getOutputPort();
    var k = n.getOutputPort();
    var d = this.startInclination.split(";");
    var q = this.endInclination.split(";");
    var c = b.x,
        p = b.y,
        a = k.x,
        o = k.y,
        m = parseFloat(b.x) + parseFloat(d[0]),
        g = parseFloat(b.y) + parseFloat(d[1]),
        l = parseFloat(k.x) + parseFloat(q[0]),
        f = parseFloat(k.y) + parseFloat(q[1]);
    if (this.startNode.isLeft()) {
        m = parseFloat(b.x) - parseFloat(d[0])
    }
    if (n.isLeft()) {
        l = parseFloat(k.x) - parseFloat(q[0])
    }
    var t = ["M", c.toFixed(3), p.toFixed(3), "C", m, g, l, f, a.toFixed(3), o.toFixed(3)].join(",");
    this.line && this.line.attr({
        path: t,
        stroke: h
    });
    if (this.endArrow != "None") {
        var r = ["M", a.toFixed(3), o.toFixed(3), "L", a + this.arrowWidth, o + this.arrowHeight, "L", a + this.arrowWidth, o - this.arrowHeight, "L", a, o].join(",");
        if (n.isLeft()) {
            r = ["M", a.toFixed(3), o.toFixed(3), "L", a - this.arrowWidth, o + this.arrowHeight, "L", a - this.arrowWidth, o - this.arrowHeight, "L", a, o].join(",")
        }
        this.arrowEnd && this.arrowEnd.attr({
            path: r,
            stroke: h,
            fill: h
        })
    }
    if (this.startArrow != "None") {
        var s = ["M", c.toFixed(3), p.toFixed(3), "L", c + this.arrowWidth, p + this.arrowHeight, "L", c + this.arrowWidth, p - this.arrowHeight, "L", c, p].join(",");
        if (n.isLeft()) {
            s = ["M", c.toFixed(3), p.toFixed(3), "L", c - this.arrowWidth, p + this.arrowHeight, "L", c - this.arrowWidth, p - this.arrowHeight, "L", c, p].join(",")
        }
        this.arrowStart && this.arrowStart.attr({
            path: s,
            stroke: h,
            fill: h
        })
    }
};
RightAngleArrowLink = function (a) {
    RightAngleArrowLink.superclass.call(this, a);
    this.defaultColor = "#aaa"
};
extend(RightAngleArrowLink, ArrowLink);
RightAngleArrowLink.prototype.type = "RightAngleArrowLink";
RightAngleArrowLink.prototype.draw = function () {
    if (this.removed) {
        return false
    }
    var k = jMap.getNodeById(this.destination);
    if (k == null || k.hided) {
        return false
    }
    var d = this.getColor();
    var b = this.startNode.getOutputPort();
    var h = k.getInputPort();
    var c = b.x,
        m = b.y,
        a = h.x,
        l = h.y;
    var g = this.startNode.getSize().width;
    var f = k.getSize().width;
    var n = ["M", c.toFixed(3), m.toFixed(3), "L", c.toFixed(3), parseInt(m) + 10];
    if (parseInt(m) > parseInt(l) - 20) {
        n = n.concat(["L", parseInt(c) + parseInt((parseInt(a) + parseInt(g) / 2 - parseInt(c) - parseInt(f) / 2) / 2), parseInt(m) + 10]);
        n = n.concat(["L", parseInt(c) + parseInt((parseInt(a) + parseInt(g) / 2 - parseInt(c) - parseInt(f) / 2) / 2), parseInt(l) - 10]);
        n = n.concat(["L", a.toFixed(3), parseInt(l) - 10])
    } else {
        n = n.concat(["L", a.toFixed(3), parseInt(m) + 10])
    }
    n = n.concat(["L", a.toFixed(3), l.toFixed(3)]);
    this.line && this.line.attr({
        path: n.join(","),
        stroke: d
    })
};