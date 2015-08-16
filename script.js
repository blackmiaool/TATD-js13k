window.onload = function () {
    var level = 0;
    var doc = document;
    var csl = console;
    var emys = [];
    var emy_tests = doc.getElementsByClassName("emy_test");
    var emys_height = [];
    var emys_width = [];
    for (var i = 0; i < emy_tests.length; i++) {
        emys_height.push(emy_tests[i].offsetHeight)
        emys_width.push(emy_tests[i].offsetWidth)
    }
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
        for (var i = this.length - 1; i >= 0; i--) {
            f(this[i]);
        }
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
    var $ = function (tag) {
        return doc.querySelector(tag);
    }
    var m = Math;
    var maps = [
            [
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
        ]
    var tower_rage = [
        [2.5, 3, 3.5],
    ]
    var maps_start = [
            [0, 2],
        ]
    var maps_end = [
            [14, 7],
        ]
    var row_sum = 10;
    var column_sum = 15;
    //    csl.log(maps)
    var mn = doc.querySelector("#mn");
    var grids = [];
    var towers = [];

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
        //        Object.prototype.add = function (to_add) {
        //            
        //        }

    function get_bit(num, pos) {
        return Math.floor(num / Math.pow(2, pos)) % 2;
    }
    var toi = parseInt;



    //        console.log(get_bit(7, 1));

    function get_pos_value(map, x, y) {
        //            console.log(map, x, y)
        return parseInt(map[y][x]);
    }

    for (var i = 0; i < row_sum * column_sum; i++) {
        var x = toi(i / column_sum);
        var y = i % column_sum;
        if (!grids[y]) {
            grids[y] = [];
        }
        var node = doc.createElement("div");
        grids[y][x] = node;

        node.className = "grid";
        mn.appendChild(node);
    }
    //        put(grids);
    var start_grid = doc.querySelector(".grid");
    //        put( );
    function enter_level(level) {
        load_map(level);
        var map = maps[level];
        map_start = maps_start[level];
        map_end = maps_end[level];

        function load_map(level) {
            for (var row = 0; row < row_sum; row++) {
                var row_value = parseInt(maps[level][row], 2);
                for (var column = 0; column < column_sum; column++) {
                    //                    grids[column][row].lang = get_bit(row_value, column_sum - column - 1) ? "wall" : "road";
                    grids[column][row].lang = get_pos_value(maps[level], column, row) ? "wall" : "road";
                }
            }
            grids[maps_start[level][0]][maps_start[level][1]].lang = "start";
            grids[maps_end[level][0]][maps_end[level][1]].lang = "end";

        }

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

        function dirs_create() { //this function can be replaced by direct array;
            var dirs = []; //0:up,1:right,2:down,3:left
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
                dirs.push(next[0]);
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
                //            put(dirs);
            return dirs;
        }
        var dirs = dirs_create();
        var paths = [];
        paths.push(clone(map_start));
        //        console.log(dirs)
        dirs.forEach(
            function (d) {
                paths.push(clone(paths.last()))
                spread_dir(function (dx, dy) {
                    point_add(paths.last(), [dx, dy])
                }, 1, d);
            }
        )

        //        console.log(paths);

        function start() {

        }



        function get_grid_pos(pos) {
            var h = start_grid.offsetHeight;
            var w = start_grid.offsetWidth;
            return [(pos[0] + 0.5) * h, (pos[1] + 0.5) * w]


        }


        var tower_create = function (kind, pos) {
            //                var tower = doc.createElement("div");
            var tower = $("#tower_to_copy").cloneNode(true);
            tower.id = undefined;
            var style = tower.style;
            tower.kind = kind;
            tower.set_pos = function (pos) {
                tower.pos = pos;
                var array = get_grid_pos(pos);
                obj_add(style, {
                    left: array[0],
                    top: array[1]
                })
            }
            tower.level = 0;
            tower.set_pos(pos);
            removeClass(tower, "hide");

            tower.register = function () {
                towers.push(tower);
            }
            var base_trans="translate(-50%, -50%)";
            tower.rotate=function(angle){
                csl.log("rrot")
                style.transform=base_trans+" rotate("+angle+"deg)";               
            }
            
            tower.querySelector(".fill").onmouseout = function () {
                var children = tower.childNodes;
                for (var i in children) {
                    if (children[i].className) {
                        removeClass(children[i], "active")
                    }
                }
            }
            tower.querySelector(".fill").onmouseover = function () {
                var children = tower.childNodes;
                for (var i in children) {
                    if (children[i].className) {
                        addClass(children[i], "active")
                    }
                }
            }
            tower.step = function () {
                
                emys.r_forEach(
                    function (e) {
                        
                        var dis=cal_dis(e.pos, tower.pos);
                        
                        if (dis< tower_rage[tower.kind][tower.level]) {
                            var angle=m.atan2(tower.pos[1]-e.pos[1],tower.pos[0]-e.pos[0]);
                            tower.rotate(angle*180/m.PI+90); 
                        }
//                        console.log(cal_dis(e.pos, tower.pos));
                    }
                )
            }
            return tower;
        }
        var emy_create = function (kind) {
            var emy = doc.createElement("div");
            emy.className = "emy";
            var style = emy.style;
            emy.set_pos = function (pos) {
                emy.pos = pos;
                var p = get_grid_pos(pos);
                p[0] -= emys_width[kind] / 2;
                p[1] -= emys_height[kind] / 2;
                style.transform = "translate(" + p[0] + "px," + p[1] + "px)";
            }
            emy.register = function () {
                emys.push(emy);

            }
            emy.unregister = function () {
                emys.remove(emy);
                emy.parentNode.removeChild(emy);
            }
            var pos;
            var dir;
            var is_continue = true;
            var speed = 0.05; //gird per sec

            var x = 0;
            var y = 0;
            var path_len = 0;

            function cal_pos() {
                dirs
            }

            emy.pos = clone(map_start);
            emy.step = function () { //called 60 times per sec 

                if (!dir) //uninited
                {
                    dir = dirs[0];
                    pos = map_start;
                    emy.set_pos(maps_start[level]);
                    return;
                }
                if (!is_continue) {
                    return
                }
                path_len += speed;
                //                    console.log(path_len);
                var path_len_i = Math.floor(path_len)
                if (path_len_i >= dirs.length) {
                    emy.unregister();
                    is_continue = false;
                    console.log("end");
                }

                var pos_now = clone(paths[path_len_i]);
                spread_dir(function (dx, dy) {
                    point_add(pos_now, [dx, dy])
                }, path_len - path_len_i, dirs[path_len_i])
                emy.pos = pos_now;
                emy.set_pos(pos_now);

            }
            return emy;
        }

        function put_tower(kind, x, y) {
            var tower = tower_create(kind, [x, y]);


            tower.register()

            mn.appendChild(tower);

        }

        function put_emy(kind) {
            var emy = emy_create(kind);


            emy.register()
            mn.appendChild(emy);

        }
        put_emy(0);
        setInterval(
            function(){
                put_emy(0);
            },1000
        )
        put_tower(0, 5, 3);
    }
    enter_level(0);
    var sys_tick_cnt = 0;

    function step() {
        sys_tick_cnt++;
//        if (!(sys_tick_cnt % 6)) {
            towers.forEach(
                function (e) {
                    e.step();
                }
            )
//        } 
        emys.forEach(
            function (e) {
                e.step();
            }
        )
        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);


}