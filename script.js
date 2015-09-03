window.onload = function () {
    var testside = "ta"
    var current_level = 0;
    g = {};
    var dbg = (localStorage.getItem("dbg") == "true") ? true : false;
    dbg_btn.innerHTML = (!dbg) ? "dbg" : "stop dbg";
    dbg_btn.onclick = function () {
        dbg = !dbg;
        localStorage.setItem("dbg", dbg ? "true" : "false");
        console.log("dbg=", dbg)
        dbg_btn.innerHTML = (!dbg) ? "dbg" : "stop dbg"
    }


    function dg(a, b) {
        if (!dbg)
            return a;
        else
            return b;
    }
    if (dbg) {
        my_panel.style.transition = "transform 0s"
    }
    var level = 0;
    var fps = 60;
    var names = ["bul", "tower", "emy"];
    var doc = document;
    var $ = function (tag) {
        return doc.querySelector(tag);
    }
    var $$ = function (tag) {
        return doc.querySelectorAll(tag);
    }
    var m = Math;
    var csl = console;
    var sys_tick = 0;
    var playing = true;
    var current_map;
    
    var miao_objs = {
        emy: [],
        bul: [],
        tower: [],
    }
    var mouseisinmn = false;
    var emys_output_finish = false;
    var start_grid;
    var end_grid;
    var dirs;
    var paths = [];
    var map;
    var sys_play_state; //ready running pause
    var std_size = {
        bul: [],
        tower: [],
        emy: []
    }
    var global_speed = 1;


    var just_a_grid;
    var maps = [
        {
            map: [
                "111111111111111",
                "111111111111111",
                "000000000000001",
                "111111111111101",
                "100000000000001",
                "101111111111111",
                "101111111111111",
                "100000000000000",
                "111111111111111",
                "111111111111111",
            ],
            start: [0, 2],
            end: [14, 7],
            hp: 20,
            power: 40,
            preset: [[6, 1, 0], [8, 1, 0], [12, 3, 0],],
        },
        {
            map: [
                "111111111111111",
                "111111111111111",
                "000011111111111",
                "111011111111111",
                "100011111111111",
                "101111111111111",
                "101111111111111",
                "100000000000000",
                "111111111111111",
                "111111111111111",
            ],
            start: [0, 2],
            end: [14, 7],
            hp: 40,
            power: 50,
            preset:[[2,5,1],[2,6,1],[2,3,0],[1,3,0],],
        },
        ]


    var speed = {
            bul: [5, 10, 15],
            tower: [30, 20, 50],
            emy: [0.03, 0.05, 0.03],
        }
        //health str callback
    var emys = [[100, 10, "None", "Basic warrior.", function () {
        var a = 1;
    }], [50, 5, "None", "Fast warrior.", function () {
        var a = 1;
    }], [170, 10, "None", "Solid warrior.", function () {
        var a = 1;
    }]];
    //range,power,des,callback,cost
    //    var towers = [[2.5, 10, "Basic tower.", function () {
    //
    //    }, 10], [2.5, 10, "Ice tower.", function () {
    //
    //    }, 10], [2.5, 10, "Basic tower.", function () {
    //
    //    }, 10]];
    var towers = [
        {
            range: 1.5,
            power: 10,
            des: "Basic tower.",
            emit: function () {},
            cost: 10,
            rotate: true,
        },
        {
            range: 1.5,
            power: 10,
            des: "Fast tower.",
            emit: function () {},
            cost: 10,
            rotate: false,
        },
        {
            range: 2.5,
            power: 137,
            des: "Powerful tower.",
            emit: function () {},
            cost: 10,
            bias: [0, -13],
            rotate: false,
        }
    ]



    var row_sum = 10;
    var column_sum = 15;

    var grids = [];


    names.forEach(
        function (name, index) {
            var d = $$("#" + name + "_to_copy");
            //            csl.log(d)
            names.forEach.call(d, function (dom) {
                std_size[name].push([dom.offsetWidth, dom.offsetHeight]);
            })
        }
    )
    csl.log("std_size", std_size)

    function set_sys_play_state(state) {
        sys_play_state = state;
        start.innerHTML = sys_play_state;
    }
    set_sys_play_state("Pause")
    Array.prototype.last = function () {
        return this[this.length - 1];
    }
    Array.prototype.remove = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj) {
                this.splice(i, 1);
            }
        }
    }
    Array.prototype.r_forEach = function (f) {
        for (var i = 0; i < this.length; i++) {
            if (f(this[i])) return;
        }
    }
    Array.prototype.average = function () {
        var sum = 0;
        this.forEach(
            function (d) {
                sum += d;
            }
        )
        if (this.length)
            sum /= this.length;
        return sum;
    }

    function hasClass(obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    function addClass(obj, cls) {
        if (!hasClass(obj, cls)) obj.className += " " + cls;
    }

    function removeClass(obj, cls) {
        if (hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    }

    function toggleClass(obj, cls) {
        if (hasClass(obj, cls)) {
            removeClass(obj, cls);
        } else {
            addClass(obj, cls);
        }
    }

    body = $("body")
    btn1.onclick = function () {
        //        addClass(title, "td");
        //        setTimeout(
        //            function () {
        //                title.innerHTML = "LV1&nbsp;-&nbsp;TD";
        //            }, 250
        //        )
        show_panel("level_failed")
    }
    btn2.onclick = function () {
        var output_str = "";
        miao_objs.tower.forEach(
            function (t) {
                output_str += "[";
                output_str += t.d.dataset.x;
                output_str += ",";
                output_str += t.d.dataset.y;
                output_str += ",";
                output_str += t.d.dataset.kind;
                output_str += "],";
            }
        )
        csl.log(output_str)
    }
    var sys_cb_queue = [];

    function sys_setTimeout(func, ticks) {
        sys_cb_queue.push([func, sys_tick + ticks]);
    }
    btn3.onclick = function () {
        btn_next_level.onclick();
    }
    btn4.onclick = function () {
        current_map.ta_finish();
    }



    function point_add(src, d) {
        src[0] += d[0];
        src[1] += d[1];
    }

    function clone(myObj) {
        if (typeof (myObj) != 'object') return myObj;
        if (myObj == null) return myObj;
        if (myObj.concat) {
            var myNewObj = [];
        } else {
            var myNewObj = {};
        }

        for (var i in myObj)
            myNewObj[i] = clone(myObj[i]);
        return myNewObj;
    }

    function obj_add(target, src) {
        for (var i in src) {
            target[i] = src[i];
        }
    }

    function get_bit(num, pos) {
        return Math.floor(num / Math.pow(2, pos)) % 2;
    }


    function get_pos_value(map, x, y) {
        //            console.log(map, x, y)
        return parseInt(map[y][x]);
    }

    for (var i = 0; i < row_sum * column_sum; i++) {
        var y = parseInt(i / column_sum);
        var x = i % column_sum;
        if (!grids[x]) {
            grids[x] = [];
        }
        var node = doc.createElement("div");
        grids[x][y] = node;

        node.className = "grid";
        node.dataset.x = x;
        node.dataset.y = y;
        mn.appendChild(node);
    }
    //        put(grids);
    just_a_grid = $(".grid");
    //    csl.log(just_a_grid)
    //        put( );

    //    function set_start_grid(){
    //        
    //    }


    function get_grid(x, y) {
        return get_bit(map[y], x);
    }

    function spread_dir(f, distance, dir) {
        var foo = [
                    [0, -distance],
                    [distance, 0],
                    [0, distance],
                    [-distance, 0],
                ]
        if (dir == undefined) {
            var ret = 0;
            for (var i in foo) {
                var v = f(foo[i][0], foo[i][1], i)
                if (v) {
                    return v;
                }
            }
            return false;

            //                    return f(-distance, 0, 3) || f(0, -distance, 0) || f(distance, 0, 1) || f(0, distance, 2);
        } else {
            //                    console.log(dir);
            return f(foo[dir][0], foo[dir][1], dir);
        }


    }

    function cal_dis(p1, p2) {
        return m.sqrt(m.pow(m.abs(p1[0] - p2[0]), 2) + m.pow(m.abs(p1[1] - p2[1]), 2));
    }

    function dirs_create(map, map_start, map_end) { //this function can be replaced by direct array;
        var dirs_this = []; //0:up,1:right,2:down,3:left
        var cnt = 0;

        function handle_grid(start, end, pre) {

            function get_next(start, pre) {
                var state = false;

                function search(x, y) {
                    if (pre) {
                        if (x == pre[0] && y == pre[1])
                            return;
                    }
                    if (!get_pos_value(map, x, y)) {
                        state = true;
                    }
                    return [false, x, y]
                }

                function is_on_earge(p) {

                    var ret = [0, 0, 0, 0];
                    if (p[0] <= 0) {
                        ret[3] = 1;
                    }
                    if (p[0] >= column_sum) {
                        ret[1] = 1;
                    }
                    if (p[1] <= 0) {
                        ret[0] = 1;
                    }
                    if (p[1] >= row_sum) {
                        ret[2] = 1;
                    }
                    return ret;

                }


                return spread_dir(function (delta_x, delta_y, dir) {

                    if (!is_on_earge(start)[dir]) {
                        var result = search(start[0] + delta_x, start[1] + delta_y);
                        if (state) {
                            result[0] = dir; //left
                            return result;
                        }
                    }
                }, 1)

            }
            var next = get_next(start, pre);
            dirs_this.push(next[0]);
            var pre = start;
            start = [next[1], next[2]];
            //                console.log(start)
            cnt++;
            if (cnt == 100)
                return;
            if (start[0] == end[0] && start[1] == end[1]) {
                return;
            } else {
                handle_grid(start, end, pre);
            }

        }
        handle_grid(map_start, map_end)
        return dirs_this;
    }









    function get_grid_pos(pos) {
        var h = 50,
            w = 50;
        return [(pos[0] + 0.5) * h, (pos[1] + 0.5) * w]
    }

    function hasChild(parent, child) {
        if (!child)
            return
        while (child.parentElement) {

            //            console.log(child.parentNode)
            if (child.parentNode == parent)
                return true;
            child = child.parentElement;
        }
        return false;
    }

    miao_obj = function () {}
    miao_obj.prototype.init = function (kind, pos, other) {
        var d = $("#" + this.name + "_to_copy[kind='" + kind + "']").cloneNode(true);
        this.kind = kind;
        this.d = d;
        this.d.id = "";
        if (speed[this.name])
            this.speed = speed[this.name][kind];
        removeClass(this.d, "hide")
        this.style = d.style;

        this.set_pos(pos);
        this.register();
    }
    miao_obj.prototype.set_pos = function (pos) {
        this.pos = clone(pos);
        var p = get_grid_pos(pos);
        p[0] -= std_size[this.name][this.kind][0] / 2;
        p[1] -= std_size[this.name][this.kind][1] / 2;
        if (this.bias) {
            point_add(p, this.bias)
        }
        this.style.transform = "translate(" + p[0] + "px," + p[1] + "px)";
    }

    miao_obj.prototype.register = function () {
        miao_objs[this.name].push(this);
        mn.insertBefore(this.d, mn.firstChild)

    }
    miao_obj.prototype.unregister = function () {
        miao_objs[this.name].remove(this);
        mn.removeChild(this.d)
    }
    miao_obj.prototype.r_unregister=function(){
        miao_objs[this.name].remove(this);
    }
    miao_obj.prototype.r_remove=function(){
        mn.removeChild(this.d)
    }

    Bul = function (kind, pos, target, bias, tower) {
        this.tower = tower;
        this.name = "bul"
        this.bias = bias;
        this.target = target;
        this.init.apply(this, arguments)

        //        console.log(target)
        this.target.add_bul(this);
    };
    Bul.prototype = new miao_obj();
    Bul.prototype.cal_pos = function (src, target, speed) {
        var dx = target[0] - src[0];
        var dy = target[1] - src[1];
        var dis = cal_dis(src, target);
        if (dis <= speed)
            return false;
        var sum = dis;
        src[0] += (target[0] - src[0]) / sum * speed;
        src[1] += (target[1] - src[1]) / sum * speed;
        return src;
    }
    Bul.prototype.step = function () {
        var pos = this.cal_pos(this.pos, this.target.pos, this.speed * global_speed / fps);
        if (!pos) {
            this.target.suffer(this.tower.kind);
            this.unregister();
        } else {
            this.set_pos(pos);
        }
    }
    Tower = function (kind, pos) {
        this.name = "tower";
        this.init.apply(this, arguments);
        this.model = towers[this.kind];
        obj_add(this, {
            level: 0,
            base_trans: "translate(-50%, -50%)",
            prepare: 0,
            prepare_max: speed.tower[kind],
        })

        var tower = this;
        this.d.querySelector(".fill").onmouseout = function () {
                var children = tower.d.childNodes;
                for (var i in children) {
                    if (children[i].className) {
                        removeClass(children[i], "active")
                    }
                }
            }
            //        console.log(pos)
        this.d.dataset.x = pos[0];
        this.d.dataset.y = pos[1];
        this.d.dataset.kind = kind;
        this.d.querySelector(".fill").onmouseover = function () {
            var children = tower.d.childNodes;
            for (var i in children) {
                if (children[i].className) {
                    addClass(children[i], "active")
                }
            }
        }

    }
    Tower.prototype = new miao_obj();
    Tower.prototype.set_pos = function (pos) {

        this.pos = clone(pos);
        var array = get_grid_pos(pos);
        obj_add(this.style, {
            left: array[0],
            top: array[1]
        })
    }
    Tower.prototype.f_rotate = function (y, x) {
        var angle = m.atan2(y, x);
        this.style.transform = this.base_trans + " rotate(" + (angle * 180 / m.PI + 90) + "deg)";

    }
    Tower.prototype.step = function () {
        if (!this.ready) {
            this.prepare += global_speed;
            if (this.prepare > this.prepare_max) {
                this.ready = true;
                //                        csl.log("ready")
            }
        }
        var tower = this;
        miao_objs.emy.r_forEach(
            function (e) {
                var dis = cal_dis(e.pos, tower.pos);
                if (dis < towers[tower.kind].range) {
                    if (tower.model.rotate)
                        tower.f_rotate(tower.pos[1] - e.pos[1], tower.pos[0] - e.pos[0])
                    if (tower.ready) {
//                        console.log(tower.pos)
                        var bul = new Bul(0, tower.pos, e, tower.model.bias ? tower.model.bias : null, tower);
                        tower.ready = false;
                        tower.prepare = 0;
                    }
                    return true;
                }
            }
        )
    }


    function put_tower(kind, x, y) {
        return new Tower(kind, [x, y]);
    }



    var Emy = function (kind, pos) {
        this.name = "emy";

        this.init.apply(this, arguments);
        obj_add(this, {
            is_continue: true,
            path_len: 0,
            initted: false,
            hp: emys[kind][0],
            str: emys[kind][1],
            click_callback: emys[kind][2],
            hp_max: emys[kind][0],
            bf: this.d.querySelector(".fill"),
            dead: false,
            buls: [],
        })
        var emy = this;
        setTimeout(
            function () {
                removeClass(emy.d, "trans")
            }, 10
        )

    }

    Emy.prototype = new miao_obj();
    Emy.prototype.add_bul = function (bul) {
        this.buls.push(bul)
    }
    Emy.prototype.destroy = function () {
        if (this.dead)
            return;
        this.dead = true;
        var e=this;
        this.buls.forEach(
            function (b) {
                addClass(b.d, "trans")
            }
        )
        addClass(this.d,"trans");
        this.r_unregister();
        setTimeout(
            function(){
                e.r_unregister();
                current_map.step();
            },500
        )
        
    }
    Emy.prototype.suffer = function (kind) {

        this.hp -= towers[kind].power;
        this.bf.style.right = (1 - this.hp / this.hp_max) * 100 + "%";
        if (this.hp <= 0) {
            this.destroy();
            
        }
    }
    Emy.prototype.step = function () {
        if (!this.initted) //uninited
        {
            this.initted = true;
            this.set_pos(maps[level].start);
            return;
        }
        if (!this.is_continue) {
            return
        }
        this.path_len += this.speed * global_speed;
        var path_len_i = Math.floor(this.path_len)
        if (path_len_i >= current_map.dirs.length) {
            current_map.suffer(this);
            this.destroy();
            this.is_continue = false;
        }

        var pos_now = clone(paths[path_len_i]);

        spread_dir(function (dx, dy) {
            point_add(pos_now, [dx, dy])
        }, this.path_len - path_len_i, current_map.dirs[path_len_i])
        this.pos = pos_now;
        this.set_pos(pos_now);
    }
    emy_create = function (kind, pos) {
        return new Emy(kind, pos);
    }

    function put_emy(kind, pos) {
        map_put(kind);
        setTimeout(
            function () {
                var emy = emy_create(kind, pos);
            }, 300
        )

    }

    function map_put(kind) {
        addClass(current_map.start_grid.querySelector(".startp"), "out");
        setTimeout(
            function () {
                removeClass(current_map.start_grid.querySelector(".startp"), "out");
            }, 500
        )
    }



    function clone_tpl(dom) {
        dom = dom.cloneNode(true);
        removeClass(dom, "hide");
        removeClass(dom, "trans");
        dom.id = "";
        return dom;
    }
    var catching_thing;


    function is_catching() {
        return (typeof (catching_thing) != "undefined");
    }

    function catch_tower(kind) {
        if (catching_thing)
            catching_thing.parentNode.removeChild(catching_thing);
        catching_thing = clone_tpl($("#tower_to_copy[kind='" + kind + "']"));
        catching_thing.style["pointer-events"] = "none";
        catching_thing.kind = kind;
        addClass(catching_thing, "catching");
        addClass(body, "catching");
        //        addClass(catching_thing,"hide");
        body.appendChild(catching_thing);
        addClass($("body"), "inactive")
        mouseisinmn = true;

        my_panel.onmouseout();
        my_panel.onmouseover();
        my_panel.onmousemove(pre_mouse_pos)
            //        
    }
    body.oncontextmenu = function () {
        if (is_catching()) {

            catching_thing.parentNode.removeChild(catching_thing);
            catching_thing = undefined;
            removeClass(body, "catching");
            return false;
        }
    }
    var pre_mouse_pos;
    my_panel.onmousemove = function (para) {

        //                console.log(para)
        //        console.log(mn.style)
        pre_mouse_pos = para;
        if (is_catching()) {
            //            console.log("m")
            if (para) {
                catching_thing.style.left = para.x;
                catching_thing.style.top = para.y;
            } else {
                console.log(my_panel)
                catching_thing.style.left = my_panel.x;
                catching_thing.style.top = my_panel.y;
            }

        }
    }

    my_panel.onmouseover = function () {
        //        console.log("over")
        if (mouseisinmn) { //trigger something

        } else {
            mouseisinmn = true;
            //            console.log("enter");
            addClass(mn, "active")
            addClass(body, "active")
            removeClass(body, "inactive");
        }


    }
    my_panel.onmouseout = function (para) {
        //        console.log("out")
        if (para) {
            if (!hasChild(mn, para.toElement)) { //really out
                mouseisinmn = false;
                //            console.log("leave");
                removeClass(mn, "active")
                removeClass(body, "active")
                addClass(body, "inactive")

            }
        } else {
            mouseisinmn = false;
            //            console.log("leave");
            removeClass(mn, "active")
            removeClass(body, "active")
            addClass(body, "inactive")
        }

    }
    mn.onclick = function (event) {
        console.log("click")
        if (catching_thing && event.target.lang == "wall") {
            if (current_map.left_tower_points >= towers[catching_thing.kind].cost) {
                current_map.left_tower_points -= towers[catching_thing.kind].cost;
                current_map.tower_points_update();
                put_tower(catching_thing.kind, parseInt(event.target.dataset.x), parseInt(event.target.dataset.y))
            } else {
                addClass(tower_points_label, "zoom");
                setTimeout(function () {
                    removeClass(tower_points_label, "zoom");
                }, 100)
            }
        }
    }

    var Map = function (level) {
        var m = this;
        this.side = "ta";
        this.level_state = "normal";

        if (testside == "td") {
            this.emy_seq = JSON.parse("[[0,0],[14,0],[33,0],[90,0]]")
            addClass(title, "td");
            setTimeout(
                function () {
                    title.innerHTML = "LV" + (level + 1) + "&nbsp;-&nbsp;TD";
                }, 300
            )
            this.half_level_finish("ta")
        } else {
            this.emy_seq = [];
            title.innerHTML = "LV" + (level + 1) + "&nbsp;-&nbsp;TA";
        }
        
        this.load_map(level);
        this.reversing = false;
        map = maps[level].map;
        this.level = level;
        this.hp = maps[level].hp;
        console.log(maps[level].hp,this.hp)
        this.hp_max = this.hp;
        this.map_start = maps[level].start;
        this.map_end = maps[level].end;
        this.dirs = dirs_create(map, this.map_start, this.map_end);
        //        console.log(this.dirs)
        paths = []
        paths.push(clone(this.map_start));
        this.dirs.forEach(
            function (d) {
                paths.push(clone(paths.last()))
                spread_dir(function (dx, dy) {
                    point_add(paths.last(), [dx, dy])
                }, 1, d);
            }
        );
        if (testside == "ta")
            this.ta_enter();
        else {
            this.td_enter();
        }





    }
    var cd=function(){
        
    }
    cd.prototype.step=function(){
        
    }
    Map.prototype.set_hp = function (hp) {
        //        csl.log(hp)

//        if (hp > -1)
        
            this.hp = hp;
        if(this.hp==undefined)
            this.hp=this.hp_max
        if (this.hp <= 0) {
            this.hp = 0;

            this.half_level_finish(this.side);
        }
        //        console.log(this.hp)

        $(".endp>.fill").style.opacity = 0.2 + 0.8 * (this.hp_max - this.hp) / this.hp_max;
        progress.innerHTML = this.hp + "/" + this.hp_max;
    }
    Map.prototype.suffer = function (emy) {
        this.set_hp(this.hp - emy.str);
    }
    Map.prototype.ta_enter = function () {
        var m = this;
        set_sys_play_state("Pause");
        emys_left.innerHTML = ""
        this.remove_things();
        left_panel.innerHTML = "";
        var tpl = $("#emy_panel_to_copy")
        this.hp = this.hp_max;
        this.set_hp(maps[current_level].hp);
        emys.forEach(function (v, k) {
            var d = tpl.cloneNode(true);
            removeClass(d, "hide")
            d.onclick = function () {

                put_emy(k, m.map_start)
                var time_now = sys_tick;
                if (m.emy_seq.length == 0) {
                    m.pre_time = time_now;
                }
                m.emy_seq.push([time_now - m.pre_time, k]);
                m.pre_time = time_now;
            }

            var emy = $("#emy_to_copy[kind='" + k + "']").cloneNode(true);
            removeClass(emy, "hide trans")
                //            console.log(emy)
            emy.id = ""
                //            console.log(d, d.querySelector(".emy"))
            left_panel.appendChild(d);
            //                d.replaceChild(emy, d.querySelector(".top>.emy"));
            var lens = [v[0], speed.emy[k] * 1000, v[1]]
            var lens_k = [0.3, 1, 3];
            Array.prototype.forEach.call(d.querySelectorAll(".bar span"),
                function (bar, index) {
                    //                    csl.log(bar)
                    bar.style.width = lens[index] * lens_k[index] + "px"
                    var value = document.createElement("label")
                    addClass(value, "prop-value");
                    value.innerHTML = parseInt(lens[index]);
                    bar.appendChild(value);
                }
            )
            d.querySelector(".top").appendChild(emy)
            d.querySelector(".bottom p").innerHTML = v[3];
        })

        maps[this.level].preset.forEach(
            function (t) {
                //                csl.log(t);
                put_tower(t[2], t[0], t[1])
            }
        )

    }



    Map.prototype.td_enter = function () {
        //        console.log("td enter")
        var m = this;

        this.level_state = "normal";
        emys_output_finish = false;
        //        console.log(JSON.stringify(this.emy_seq));
        set_sys_play_state("Start");
        this.remove_things();
        this.emy_seq_len = this.emy_seq.length;
        emys_left.innerHTML = this.emy_seq.length + "/" + this.emy_seq_len;
        left_panel.innerHTML = "";
        var tpl = $("#tower_panel_to_copy")
        this.hp = this.hp_max;
        this.set_hp();
        tower_points = tower_points_to_copy.cloneNode(true);
        tower_points.id = "tower_points";
        tower_points_value = tower_points.querySelector("#tower_points_value");
        tower_points_label = tower_points.querySelector("#tower_points_label");
        left_panel.appendChild(tower_points);
        this.side_init();
        towers.forEach(function (v, k) {
            var d = tpl.cloneNode(true);
            removeClass(d, "hide")
            d.onclick = function () {

                catch_tower(k, m.map_start)
            }

            var tower = $("#tower_to_copy[kind='" + k + "']").cloneNode(true);
            removeClass(tower, "hide")
            removeClass(tower, "trans")
                //            console.log(tower)
            tower.id = ""
            left_panel.appendChild(d);

            console.log(v)
            var lens = [v.power, v.range, 1 / speed.tower[k] / 3 * 900, v.cost]
            var lens_k = [3, 20, 3, 3]
            Array.prototype.forEach.call(d.querySelectorAll(".bar span"),
                function (bar, index) {
                    //                    csl.log(bar)
                    bar.style.width = lens[index] * lens_k[index] + "px";
                    var value = document.createElement("label")
                    addClass(value, "prop-value");

                    value.innerHTML = index != 1 ? parseInt(lens[index]) : lens[index];
                    bar.appendChild(value);
                }
            )


            d.querySelector(".top").appendChild(tower)
            d.querySelector(".bottom p").innerHTML = v.des;

        })
    }
    Map.prototype.tower_points_update = function () {
        tower_points_value.innerHTML = this.left_tower_points;
    }
    Map.prototype.side_init = function () {
        if (this.side == "ta") {

        } else {
            this.left_tower_points = maps[this.level].power;
            tower_points_value.innerHTML = this.left_tower_points;
        }
    }
    Map.prototype.remove_things = function () {
        //        console.log("remove_things")
        names.forEach(
                function (name) {
                    //                console.log("name ", name)
                    //                console.log(miao_objs[name])
                    var len = miao_objs[name].length;
                    for (var i = len - 1; i >= 0; i--) {
                        var obj = miao_objs[name][i];
                        //                    console.log(obj)
                        if (obj.destroy) {
                            obj.destroy()
                        } else {

                            obj.unregister();
                        }
                    }
                }
            )
            //        console.log(miao_objs)
    }
    Map.prototype.start = function () {
        var seq = current_map.emy_seq;
        //        csl.log(seq, seq.length)
        var index = 0;
        var kind_next;

        function output_emy() {
            emys_left.innerHTML = (current_map.emy_seq_len - index - 1) + "/" + current_map.emy_seq_len;
            put_emy(kind_next, current_map.map_start)
            index++;
            if (index < seq.length) {
                kind_next = seq[index][1];
                sys_setTimeout(
                    output_emy, seq[index][0]
                )
            } else {
                emys_output_finish = true;
            }
        }
        if (seq.length) {
            kind_next = seq[0][1];
            output_emy();
        }
    }

    function reverse(dom) {
        //        console.log(dom)
        var rotate = "scaleX(-1)";
        //        console.log(dom.style.transform.lastIndexOf(rotate))
        if (dom.style.transform.lastIndexOf(rotate) > -1) {
            //            console.log("replace", dom.style.transform)
            var temp = dom.style.transform;
            var sps = temp.split(" ")
            if (sps.length > 1)
                temp = sps[0]
            else
                temp = ""
                //            temp.replace(/rot/g,"s")
                //            console.log("temp", temp)
            dom.style.transform = temp;

        } else {
            //            console.log("+=", " " + dom.style.transform)
            dom.style.transform += rotate;
        }
        //        console.log("finish", dom.style.transform)
    }
    Map.prototype.half_level_finish = function (state) {
        //        console.log(state);
        var m = this;

        if (this.reversing)
            return;
        else

            var endp = $(".endp>.fill")
        endp.style.transition = "transform " + dg("3.5", "0.1") + "s ease-in";
        if (state == "ta") {
            this.reversing = true;
            addClass(endp, "rotate")

            setTimeout(
                function () {
                    m.reversing = false;
                }, dg(4000, 0)
            )
            setTimeout(
                function () {
                    reverse(startp_to_copy);
                    reverse(endp_to_copy);
                    my_panel.style.transform += " rotateY(180deg)"
                    reverse(my_panel.querySelector(".ftr"))

                    endp.style.transition = "transform " + dg("3.5", "0.1") + "s ease-out";
                    removeClass(endp, "rotate")
                }, dg(3000, 0)
            )

            setTimeout(
                function () {
                    reverse(left_panel);
         
                        m.side = "td";
                        m.td_enter();
                        addClass(title, "td");
                        setTimeout(
                            function () {
                                title.innerHTML = "LV"+(m.level+1)+"&nbsp;-&nbsp;TD";
                            }, 250
                        )
               
                }, dg(3300, 0)
            )
        } else {
            //            console.log("tttttttt")
            //            enter_level(this.level);
            show_panel("level_failed");

            this.level_state = "failed";
        }

    }

    Map.prototype.load_map = function (level) {
        for (var row = 0; row < row_sum; row++) {
            var row_value = parseInt(maps[level].map[row], 2);
            for (var column = 0; column < column_sum; column++) {
                //                    grids[column][row].lang = get_bit(row_value, column_sum - column - 1) ? "wall" : "road";
                grids[column][row].lang = get_pos_value(maps[level].map, column, row) ? "wall" : "road";
            }
        }
        this.start_grid = grids[maps[level].start[0]][maps[level].start[1]]
        this.start_grid.lang = "start";
        this.start_grid.appendChild($("#startp_to_copy"))
        this.end_grid = grids[maps[level].end[0]][maps[level].end[1]];
        this.end_grid.lang = "end";
        this.end_grid.appendChild(endp_to_copy);

    }
    Map.prototype.destroy = function () {
        console.log(this.side)
        console.log(my_panel.style.transform)
        if (this.side == "td") {
            var m = this;
            reverse(startp_to_copy);
            reverse(endp_to_copy)
            my_panel.style.transform += " rotateY(180deg)"
            reverse(left_panel);
            reverse(my_panel.querySelector(".ftr"))
//            addClass(title, "td");
//            title.innerHTML = "LV" + (this.level + 1) + "&nbsp;-&nbsp;TA";
        }
        this.remove_things();
    }
    Map.prototype.step = function () {
        //        console.log("step", miao_objs.emy, miao_objs.emy.length, emys_output_finish)
        if (miao_objs.emy.length == 0 && emys_output_finish && this.side == "td") {
            if (this.level_state == "normal") {
                this.level_state = "success";
                console.log("finish");

                function set_success_info() {
                    for (var i = 0; i < 3; i++) {
                        var selector = "#scores>div:nth-child(" + (i + 1) + ")>label:nth-child(" + 2 + ")";
                        //                        console.log(i,selector,$(selector));
                        $(selector).innerHTML = arguments[i];
                    }

                }
                var time_cost = 0;
                this.emy_seq.forEach(
                        function (i) {
                            time_cost += i[0];
                        }
                    )
                    //                for(var i in this.emy_seq){
                    //                    console.log(this.emy_seq[i],this.emy_seq[i][0])
                    //                    
                    //                    csl.log(time_cost)
                    //                }
                    //                csl.log(time_cost);
                time_cost /= 60; //s
                time_cost *= 1000; //ms
                console.log(this.emy_seq)


                set_success_info(this.emy_seq.length, maps[this.level].power - this.left_tower_points, parseInt(time_cost) + "ms")
                show_panel("level_finish")
            }

        }
    }

    function enter_level(level) {
        if (current_map) {
            current_map.destroy();
        }

        current_map = new Map(level)
    }

    enter_level(current_level);


    function obj_step(e) {
        e.step();
    }

    start.onclick = function () {
        switch (sys_play_state) {
        case "Pause":
            {
                set_sys_play_state("Play");
                break;
            }
        case "Start":
            {
                current_map.start();
                set_sys_play_state("Pause");
                break;
            }
        case "Play":
            {

                set_sys_play_state("Pause");
                break;
            }

        }

    }

    function set_global_speed(times) {
        global_speed = times;
    }
    function set_speed_btn(btn,speed){
        (new Array).forEach.call($$(".speed .top-btn"),
            function(btn){
                addClass(btn,"inactive")
            }
        )
        removeClass(btn,"inactive");
        set_global_speed(speed)
    }
    speedfor1.onclick = function () {
        set_speed_btn(speedfor1,1);
    }
    speedfor2.onclick = function () {
        set_speed_btn(speedfor2,2);
    }
    speedfor4.onclick = function () {
        set_speed_btn(speedfor4,16);
    }

    function fadeout(d, time) {
        d.style.transition = "opacity " + time + "ms";

        addClass(d, "trans")
        setTimeout(function () {
            hide(d);
        }, time)
    }

    function fadein(d, time) {
        //        console.log(d)
        d.style.transition = "opacity " + time + "ms";
        show(d);
        setTimeout(
            function () {
                removeClass(d, "trans")
            }, 100
        )

    }

    function show(d) {
        removeClass(d, "displaynone");

    }

    function hide(d) {
        addClass(d, "displaynone");
    }
    btn_restart.onclick = function () {
        if (current_map.side == "ta") {
            hide($("#level_setting #btn_restart_defence1"));
        } else {
            show($("#level_setting #btn_restart_defence1"));
        }
        show_panel("level_setting");

    }

    function restart_whole_level() {
        //        current_map.destroy();
        enter_level(current_level);
        hide_panel("level_setting")
        hide_panel("level_failed")
        current_map.reversing = false;
    }
    btn_restart_attack.onclick = restart_whole_level;
    btn_restart_whole_level.onclick = restart_whole_level;

    function restart_defence() {
        level_state = "normal";
        current_map.td_enter();
        hide_panel("level_failed")
        current_map.reversing = false;
    }
    btn_restart_defence1.onclick = restart_defence;
    btn_restart_defence2.onclick = restart_defence;

    function hide_panel(name) {
        fadeout($("#" + name), 500);
        fadeout(body_mask, 500)
    }
    btn_continue.onclick = function () {

        hide_panel("level_setting");
    }
    btn_next_level.onclick = function () {
        hide_panel("level_finish");

        enter_level(++current_level);

    }

    function show_panel(name) {
        fadein(body_mask, 500);
        fadein($("#" + name), 500);
    }

    function step() {
        if (sys_play_state == "Pause") {
            sys_cb_queue.forEach(
                function (cb, i) {
                    if (sys_tick >= cb[1]) {
                        cb[0]();
                        sys_cb_queue.splice(i, 1);
                    }
                }
            )
            if (!(sys_tick % 120)) {

            }
            for (var i in miao_objs) {
                miao_objs[i].forEach(obj_step);
            }
            //            current_map.step();
            sys_tick += global_speed;
        }
        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);


}