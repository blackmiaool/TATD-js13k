window.onload = function () {


    var testside = "ta"
    var current_level = 0;
    g = {};
    var dbg = (localStorage.getItem("dbg") == "true") ? true : false;
    if (dbg) {
        my_panel.style.transition = "transform 0s"
        current_level = 6;
        testside="td";
    }
    dbg_btn.innerHTML = (!dbg) ? "dbg" : "stop dbg";

    function toggle_dbg() {
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


    var level = 0;
    var fps = 60;
    var panel_showing = false;
    var names = ["bul", "tower", "emy"];
    var doc = document;
    var $ = function (tag) {
        return doc.querySelector(tag);
    }
    var $$ = function (tag) {
        return doc.querySelectorAll(tag);
    }
    body = $("body")
    if (dbg) {
        (new Array).forEach.call($$(".debug-btn"), function (e, i) {
            e.style.display = "inline-block"
        })
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
    var towers_sound = [[1, , 0.1693, 0.111, 0.0106, 0.8855, 0.0802, -0.5639, , , , , , 0.0314, 0.1647, , , , 1, , , , , 0.5],
                     [3, , 0.01, , 0.206, 0.4598, , -0.4236, , , , , , , , , , , 1, , , , , 0.44],
                      [0, , 0.2368, 0.1023, , 0.7157, 0.2, -0.2371, , , , , , 0.446, -0.1164, , , , 1, , , 0.2673, , 0.44],
                      [2, , 0.2386, 0.2191, 0.3293, 0.6307, 0.0235, -0.405, , , , , , 0.7376, -0.6784, , , , 1, , , , , 0.5],
                     ]
    var map_suffer_sound = [3, , 0.2585, 0.7193, 0.0618, 0.7524, , -0.389, , , , 0.4458, 0.8618, , , , 0.1306, -0.1808, 1, , , , , 0.44];
    var level_finish_sound = [0, , 0.2352, , 0.4135, 0.4361, , 0.4238, , , , , , 0.1343, , 0.5811, , , 1, , , , , 0.44];
    var new_unit = [1, , 0.3399, , 0.4035, 0.3884, , 0.4556, , , , , , , , 0.5184, , , 1, , , , , 0.44];
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
            hp: 1,
            power: 45,
            preset: [[6, 1, 0], [8, 1, 0], [8, 3, 0], ],
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
            hp: 3,
            power: 50,
            preset: [[2, 5, 1], [2, 6, 1], [2, 3, 0], [1, 3, 0], ],
        },
        {
            map: [
                "111111101111111",
                "111111101111111",
                "111111100111111",
                "111111110111111",
                "111100000111111",
                "111101111111111",
                "111101111111111",
                "111101111111111",
                "111101111111111",
                "111101111111111",
            ],
            start: [7, 0],
            end: [4, 9],
            hp: 2,
            power: 60,
            preset: [[5, 5, 1], [7, 3, 0], [6, 2, 0], ],
        },
        {
            map: [
                "111111101111111",
                "111111101111111",
                "111111100111111",
                "111111110111111",
                "111111100111111",
                "111111101111111",
                "111111100111111",
                "111111110111111",
                "111111110111111",
                "111111110111111",
            ],
            start: [7, 0],
            end: [8, 9],
            hp: 5,
            power: 60,
            preset: [[7, 3, 1], [8, 5, 1], [8, 1, 2], [7, 7, 0], ],
        },
        {
            map: [
                "111111101111111",
                "111111101111111",
                "111111101111111",
                "111111101111111",
                "111111101111111",
                "111111101111111",
                "111111101111111",
                "111111101111111",
                "111111101111111",
                "111111101111111",
            ],
            start: [7, 0],
            end: [7, 9],
            hp: 5,
            power: 80,
            preset: [[8, 4, 2], [6, 6, 2], [8, 5, 0], [8, 6, 0], [6, 5, 0]],
        },
        {
            map: [
                "011111111111111",
                "001111111111111",
                "100111111111111",
                "110011111111111",
                "111001111111111",
                "111100111111111",
                "111110011111111",
                "111111001111111",
                "111111100111111",
                "111111110111111",
            ],
            start: [0, 0],
            end: [8, 9],
            hp: 5,
            power: 80,
            preset: [[5, 4, 2], [7, 6, 3], [3, 5, 1], [4, 6, 1], [6, 5, 1]],
        },
        {
            map: [
                "011111111111111",
                "000001111111111",
                "111101111111111",
                "110001111111111",
                "110110001111111",
                "110000101111111",
                "111111101111111",
                "111111101111111",
                "111111100111111",
                "111111110111111",
            ],
            start: [0, 0],
            end: [8, 9],
            hp: 10,
            power: 100,
            preset: [[5, 3, 3], [6, 6, 0], [3, 4, 1], [4, 4, 0], [6, 5, 1]],
        },

        ]


    var speed = {
            bul: [4, 5, 5, 5, 5, 5],
            tower: [30, 50, 50, 60],
            emy: [0.03, 0.05, 0.03, 0.02],
        }
        //health str callback
        //    var emys = [[100, 10, "None", "Basic warrior.", function () {
        //        var a = 1;
        //    }], [50, 5, "None", "Fast warrior.", function () {
        //        var a = 1;
        //    }], [170, 10, "None", "Solid warrior.", function () {
        //        var a = 1;
        //    }]];
    var emys = [
            {
                hp: 70,
                str: 1,
                des: "Basic warrior.",
                cb: function () {},
                cd: 0.5,

        },
            {
                hp: 70,
                str: 1,
                des: "Fast warrior.",
                cb: function () {},
                cd: 0.3,
                st: 2,
        },
            {
                hp: 110,
                str: 2,
                des: "Solid warrior.",
                cb: function () {},
                cd: 1,
                st: 4,
        },
            {
                hp: 300,
                str: 3,
                des: "Final warrior.",
                cb: function () {},
                cd: 1.5,
                st: 6,
        },
    ]
        //range,power,des,callback,cost
        //    var towers = [[2.5, 10, "Basic tower.", function () {
        //
        //    }, 10], [2.5, 10, "Ice tower.", function () {
        //
        //    }, 10], [2.5, 10, "Basic tower.", function () {
        //
        //    }, 10]];
    var states = {

        cold: {
            add: function (emy) {
                var speed_k = 0.4
                addClass(emy.d, "cold");

                if (emy.cold_cnt == undefined)
                    emy.cold_cnt = 0;
                emy.cold_cnt++;
                if (emy.cold_cnt == 1) {
                    emy.speed_k *= speed_k;
                }
                sys_setTimeout(
                    function () {
                        emy.cold_cnt--;
                        if (emy.cold_cnt == 0) {
                            removeClass(emy.d, "cold");
                            emy.speed_k /= speed_k;
                        }

                    }, fps
                )
            },
        },
    }
    var towers = [
        {
            range: 2,
            power: 10,
            des: "Basic tower.",
            //            emit: function () {},
            cost: 10,
            rotate: true,
        },
        {
            range: 1.5,
            power: 10,
            des: "AOE tower.",

            emit: function (tower) {
                //                console.log(tower)
                var loop = doc.createElement("div");
                addClass(loop, "loop");
                tower.d.appendChild(loop);
                sys_setTimeout(
                    function () {
                        miao_objs.emy.forEach(
                            function (e) {
                                var dis = cal_dis(e.pos, tower.pos);
                                if (dis < towers[tower.kind].range) {
                                    //                                    console.log("s")
                                    e.suffer(tower.kind)
                                }
                            }
                        )
                    }, 900 / 4 / 1000 * 60
                )
                setTimeout(
                    function () {
                        if (tower) {
                            tower.d.removeChild(loop);
                        }
                    }, 900
                )
            },
            cost: 15,
            rotate: false,
            st: 1,
        },
        {
            range: 2.5,
            power: 5,
            des: "Cold tower.",
            blast: function (emy) {
                emy.add_state(states.cold)

            },
            cost: 20,
            bias: [0, -15],
            rotate: false,
            st: 3,
        },
        {
            range: 1.5,
            power: 30,
            des: "Powerful tower.",
            //            emit: function () {},
            cost: 25,
            bias: [0, 0],
            rotate: false,
            st: 5,
        }
    ]

    dbg_btn.onclick = toggle_dbg;
    body.onkeypress = toggle_dbg;

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
        var config = [func, sys_tick + ticks]
        sys_cb_queue.push(config);
        return config;
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
    miao_obj.prototype.r_unregister = function () {
        miao_objs[this.name].remove(this);
    }
    miao_obj.prototype.r_remove = function () {
        mn.removeChild(this.d)
    }
    var emy_order_cal = false;
    Bul = function (kind, pos, target, bias, tower) {
        if (kind > 1)
            kind = 1;


        this.tower = tower;
        tower.target = target;
        this.name = "bul"
        this.bias = bias;
        this.target = target;
        this.init.apply(this, arguments)

        //        console.log(target)
        this.target.add_bul(this);
        this.step();
    };

    Bul.prototype = new miao_obj();
    Bul.prototype.blast = function () {
        this.target.suffer(this.tower.kind, this.tower);
        this.unregister();
    }
    Bul.prototype.cal_pos = function (src, target, speed) {
        var dis = cal_dis(src, target);
        var dx = target[0] - src[0];
        var dy = target[1] - src[1];

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
            this.blast();
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
                        if (towers[tower.kind].emit) {
                            towers[tower.kind].emit(tower);
                        } else {
                            var bul = new Bul(tower.kind, tower.pos, e, tower.model.bias ? tower.model.bias : null, tower);

                        }
                        tower.ready = false;
                        tower.prepare = 0;
                    }
                    return true;
                }
            }
        )
    }


    function put_tower(kind, x, y,update) {
        if(update){
        if(current_map&&towers_map)
        {towers_map[kind]++;
        current_map.set_tower_panel();}}
        return new Tower(kind, [x, y]);
    }



    var Emy = function (kind, pos) {
        this.name = "emy";

        this.init.apply(this, arguments);
        obj_add(this, {
            is_continue: true,
            path_len: 0,
            initted: false,
            hp: emys[kind].hp,
            str: emys[kind].str,
            click_callback: emys[kind].cb,
            hp_max: emys[kind].hp,
            bf: this.d.querySelector(".fill"),
            dead: false,
            buls: [],
        })
        this.states = [];
        this.speed_k = 1;
        var emy = this;
        setTimeout(
            function () {
                removeClass(emy.d, "trans")
            }, 10
        )
        this.step();

    }

    Emy.prototype = new miao_obj();
    Emy.prototype.add_bul = function (bul) {
        this.buls.push(bul)
    }
    Emy.prototype.add_state = function (state) {
        state.add(this);

    }
    Emy.prototype.destroy = function () {
        if (this.dead)
            return;
        this.dead = true;
        var e = this;
        this.buls.forEach(
            function (b) {
                addClass(b.d, "trans")
            }
        )
        addClass(this.d, "trans");
        this.r_unregister();
        setTimeout(
            function () {
                e.r_unregister();
                current_map.step();
            }, 500
        )

    }
    Emy.prototype.suffer = function (kind) {
        play_sound(towers_sound[kind])
        this.hp -= towers[kind].power;
        if (towers[kind].blast)
            towers[kind].blast(this);
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
        this.path_len += this.speed * global_speed * this.speed_k;;
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
        sys_setTimeout(
            function () {
                var emy = emy_create(kind, pos);
            }, 300 / 1000 * fps
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

    function uncatch() {
        if (is_catching()) {

            catching_thing.parentNode.removeChild(catching_thing);
            catching_thing = undefined;
            removeClass(body, "catching");

        }
    }
    body.oncontextmenu = function () {
        if (is_catching()) {

            uncatch();
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
        //        console.log("click")
        if (catching_thing && event.target.lang == "wall") {
            if (current_map.left_tower_points >= towers[catching_thing.kind].cost + towers_map[catching_thing.kind] * 5) {
                current_map.left_tower_points -= towers[catching_thing.kind].cost;
                current_map.tower_points_update();
                put_tower(catching_thing.kind, parseInt(event.target.dataset.x), parseInt(event.target.dataset.y),true)
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
        //        console.log(maps[level].hp, this.hp)
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

    Map.prototype.set_hp = function (hp) {
        this.hp = hp;
        if (this.hp == undefined)
            this.hp = this.hp_max
        if (this.hp <= 0) {
            this.hp = 0;

            this.half_level_finish(this.side);
        }
        //        console.log(this.hp)

        $(".endp>.fill").style.opacity = 0.2 + 0.8 * (this.hp_max - this.hp) / this.hp_max;
        progress.innerHTML = this.hp + "/" + this.hp_max;
    }
    Map.prototype.suffer = function (emy) {
        play_sound(map_suffer_sound);
        this.set_hp(this.hp - emy.str);
    }
    Map.prototype.enter_init = function () {

    }
    var emy_queue = [];
    var queue_speed = 150; //150px/s
    Eq = function (k, cb) {
        this.kind = k;
        this.cb = cb;
        this.emy = clone_tpl($("#emy_to_copy[kind='" + k + "']"));
        this.grid = emy_queue_grid_to_copy.cloneNode(true);
        this.grid.id = "";
        this.wrap = this.grid.querySelector(".wrap");
        this.wrap.appendChild(this.emy)
        left_panel.querySelector(".emy_queue").appendChild(this.grid)
        this.height = emys[k].cd * queue_speed;
        //        console.log(emys[k].cd,queue_speed)
        this.height_max = this.height;
        this.wrap.style.height = this.height;


        this.set_height(this.height);

        emy_queue.push(this);

    }
    Eq.prototype.set_height = function (h) {
        //        console.log(h)

        this.height = h;
        this.grid.style.height = h;
        this.wrap.style.top = -(this.height_max - h);
    }
    Eq.prototype.unregister = function () {
        //        console.log(sys_tick)
        if (current_map.side == "ta")
            this.cb();
        emy_queue.remove(this);
        //        console.log("un")
    }
    Eq.prototype.step = function () {
        //        console.log("step")
        this.height -= queue_speed / 60;
        this.set_height(this.height);
        if (this.height <= 0) {
            this.unregister();
        }
    }

    function eq_step() {
        for (var i = 0; i < global_speed; i++) {
            if (emy_queue[0]) {
                emy_queue[0].step();
            }
        }
    }



    function get_emy_block(v, k) {
        var d = clone_tpl($("#emy_panel_to_copy"))
        var emy = clone_tpl($("#emy_to_copy[kind='" + k + "']"));
        var lens = [v.hp, speed.emy[k] * 1000, v.str]
        var lens_k = [0.2, 1, 15];
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
        d.querySelector(".bottom p").innerHTML = v.des;
        return d;
    }
    Map.prototype.ta_enter = function () {
        var m = this;
        set_sys_play_state("Pause");
        emys_left.innerHTML = ""
        this.remove_things();
        left_panel.innerHTML = "";
        setTimeout(
            function () {
                emys_left.innerHTML = ""

                function check_new_unit(v, k) {
                    if (v.st === m.level) {
                        csl.log(v.st, m.level)
                        play_sound(new_unit)
                        show_panel("new_panel");
                        $("#new_panel").querySelector("#panel").innerHTML = "";

                        if (!v.range) {
                            $("#new_panel").querySelector("h1").innerHTML = "New Warrior";
                            $("#new_panel").querySelector("#panel").appendChild(get_emy_block(v, k));
                        } else {
                            $("#new_panel").querySelector("h1").innerHTML = "New Tower";
                            $("#new_panel").querySelector("#panel").appendChild(get_tower_block(v, k,true));
                        }

                    }

                }
                if (!dbg) {
                    emys.forEach(check_new_unit)
                    towers.forEach(check_new_unit)
                }



            }, 50
        )


        this.hp = this.hp_max;
        this.set_hp(maps[current_level].hp);
        this.queue = emy_queue_to_copy.cloneNode(true);
        left_panel.appendChild(this.queue);
        emys.forEach(function (v, k) {
            if (v.st) {
                if (current_level < v.st) {
                    return;
                }
            }
            var d = get_emy_block(v, k);
            d.onclick = function () {
                var e = new Eq(k, function () {
                    put_emy(k, m.map_start)
                    var time_now = sys_tick;
                    if (m.emy_seq.length == 0) {
                        m.pre_time = time_now;
                    }
                    m.emy_seq.push([time_now - m.pre_time, k]);
                    m.pre_time = time_now;
                });

            }
            left_panel.appendChild(d);
        })

        maps[this.level].preset.forEach(
            function (t) {

                var t = put_tower(t[2], t[0], t[1],false);
                addClass(t.d, "preset");
            }
        )

    }



    function get_tower_block(v, k,raw) {
        var d = clone_tpl($("#tower_panel_to_copy"))
        var tower = clone_tpl($("#tower_to_copy[kind='" + k + "']"))

        var lens = [v.power, v.range, 1 / speed.tower[k] / 3 * 900, v.cost + (raw?  0:towers_map[k] * 5 )]
        tower_lens_k = [3, 20, 3, 2]
        Array.prototype.forEach.call(d.querySelectorAll(".bar span"),
            function (bar, index) {
                //                    csl.log(bar)
                bar.style.width = lens[index] * tower_lens_k[index] + "px";
                var value = document.createElement("label")
                addClass(value, "prop-value");

                value.innerHTML = index != 1 ? parseInt(lens[index]) : lens[index];
                bar.appendChild(value);
            }
        )


        d.querySelector(".top").appendChild(tower)
        d.querySelector(".bottom p").innerHTML = v.des;
        return d;
    }


    Map.prototype.td_enter = function () {
        //        console.log("td enter")
        var m = this;
        towers_map = [0, 0, 0, 0, 0, 0];
        this.level_state = "normal";
        emys_output_finish = false;
        //        console.log(JSON.stringify(this.emy_seq));
        set_sys_play_state("Start");
        this.remove_things();
        this.emy_seq_len = this.emy_seq.length;
        emys_left.innerHTML = this.emy_seq.length + "/" + this.emy_seq_len;
        

        this.hp = this.hp_max;
        this.set_hp();

        this.set_tower_panel();



    }
    Map.prototype.set_tower_panel = function () {
        this.side_init();

        towers.forEach(function (v, k) {
            if (v.st) {
                if (current_level < v.st) {
                    return;
                }
            }
            var d = get_tower_block(v, k);


            left_panel.appendChild(d);
            d.onclick = function () {

                catch_tower(k, m.map_start)
            }

        })
    }
    Map.prototype.tower_points_update = function () {
        tower_points_value.innerHTML = this.left_tower_points;
    }
    Map.prototype.side_init = function () {
        //        
        if (this.side == "ta") {

        } else {
            left_panel.innerHTML = "";
            tower_points = tower_points_to_copy.cloneNode(true);
            tower_points.id = "tower_points";
            tower_points_value = tower_points.querySelector("#tower_points_value");
            tower_points_label = tower_points.querySelector("#tower_points_label");
            left_panel.appendChild(tower_points);
            this.left_tower_points = maps[this.level].power;
            for (var i = 0; i < towers.length; i++) {
                for (var j = 0; j < towers_map[i]; j++) {
                    this.left_tower_points -= towers[i].cost + j * 5;
                }

            }
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
        sys_cb_queue.length = 0;
        emy_queue.length = 0;
        //        console.log(miao_objs)
    }
    Map.prototype.start = function () {
        var seq = current_map.emy_seq;
        //        csl.log(seq, seq.length)
        var index = 0;
        var kind_next;
        var map = this;

        function output_emy() {
            emys_left.innerHTML = (current_map.emy_seq_len - index - 1) + "/" + current_map.emy_seq_len;
            put_emy(kind_next, current_map.map_start)
            index++;
            if (index < seq.length) {
                kind_next = seq[index][1];
                map.outputing = sys_setTimeout(
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

        play_sound(level_finish_sound);
        towers_map = [0, 0, 0, 0, 0, 0];
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
                            title.innerHTML = "LV" + (m.level + 1) + "&nbsp;-&nbsp;TD";
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
        sys_cb_queue.remove(this.outputing)
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


                set_success_info(this.emy_seq.length, maps[this.level].power - this.left_tower_points, parseInt(time_cost) + "ms");
                show_panel("level_finish");
//                if (current_level == (maps.length - 1)) {
//                    show_panel("game_over");
//                } else {
//
//                    
//                }

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

    function set_speed_btn(btn, speed) {
        (new Array).forEach.call($$(".speed .top-btn"),
            function (btn) {
                addClass(btn, "inactive")
            }
        )
        removeClass(btn, "inactive");
        set_global_speed(speed)
    }
    speedfor1.onclick = function () {
        set_speed_btn(speedfor1, 1);
    }
    speedfor2.onclick = function () {
        set_speed_btn(speedfor2, 2);
    }
    speedfor4.onclick = function () {
        set_speed_btn(speedfor4, 16);
    }

    function fadeout(d, time, up) {
        addClass(d, "fadingout");
        d.style.transition = "all " + time + "ms";
        if (up) {
            removeClass(d, "center");
        }
        addClass(d, "trans")
        d.dataset.fadingcb = setTimeout(function () {

            removeClass(d, "fadingout");
            hide(d);
        }, time)
    }

    function fadein(d, time, down) {
        //        console.log(d)
        d.style.transition = "all " + time + "ms";
        show(d);

        setTimeout(
            function () {
                if (down) {
                    addClass(d, "center");
                }
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
        hide_panel("level_setting")
        current_map.reversing = false;
    }
    btn_restart_defence1.onclick = restart_defence;
    btn_restart_defence2.onclick = restart_defence;

    function hide_panel(name) {
        fadeout($("#" + name), 500, true);
        fadeout(body_mask, 500)
        panel_showing = false;;
    }
    btn_continue.onclick = function () {

        hide_panel("level_setting");
    }
    btn_next_level.onclick = function () {
        hide_panel("level_finish");
        setTimeout(
            function(){
                if(current_level == (maps.length - 1)){
                    show_panel("game_over")
                }else{
                    enter_level(++current_level);
                }
                
            },550
        )
        

    }
    btn_new_start.onclick = function () {
        hide_panel("new_panel")
    }

    function show_panel(name) {
        uncatch();
        if (current_map.reversing)
            return;
        fadein(body_mask, 500);
        addClass($("#" + name), "down")
        fadein($("#" + name), 300, true);
        panel_showing = true;
    }
    btn_start_game.onclick = function () {
        hide_panel("game_cover")
    }
    if (!dbg) show_panel("game_cover")


    console.log(jsfxr);
    //    var tes=[0,391.38368610805287,100000,1,0,0.5,0,1,20032,0,0.1,1,0.55,0,1,0,0,0,501,9955,0.5444117140257732,0,0,0,0.2840254166877416,44100,8,]



    function play_sound(so) {
        var soundURL = jsfxr(so);
        var player = new Audio();
        player.src = soundURL;
        if (!dbg) {
            player.play();
        }

    }



    function step() {
        if (sys_play_state == "Pause" && !panel_showing) {

            emy_order_cal = true;
            miao_objs.emy.sort(
                function (a, b) {
                    if (a.path_len > b.path_len)
                        return -1;
                    else if (a.path_len == b.path_len)
                        return 0;
                    else
                        return 1;
                }
            )

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
            eq_step();
            //            current_map.step();
            sys_tick += global_speed;
        }
        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);


}