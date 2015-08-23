window.onload = function () {

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
    var m = Math;
    var csl = console;
    var sys_tick_cnt = 0;
    var playing = true;
    var current_map;
    var miao_objs = {
        emy: [],
        bul: [],
        tower: [],
    }
    var mouseisinmn=false;
    var start_grid;
    var end_grid;
    var dirs;
    var paths = [];
    var map;

    var std_size = {
        bul: [],
        tower: [],
        emy: []
    }
    var global_speed = 1;


    var just_a_grid;
    var speed = {
            bul: [5, 10, 15],
            tower: [],
            emy: [0.03, 0.05],
        }
        //health str callback
    var emys = [[100, 10, "None", "Basic warrior.", function () {
        var a = 1;
    }], ];
    //rage,power,des,callback
    var towers = [[2.5, 10,"Basic tower." ,function () {

    }]];



    var maps_start = [
            [0, 2],
        ]
    var maps_end = [
            [14, 7],
        ]
    var row_sum = 10;
    var column_sum = 15;
    //    csl.log(maps)
    //    var mn = doc.querySelector("#mn");
    var grids = [];


    names.forEach(
        function (name, index) {
            var d = doc.querySelectorAll("#" + name + "_to_copy");
            //            csl.log(d)
            names.forEach.call(d, function (dom) {
                std_size[name].push([dom.offsetWidth, dom.offsetHeight]);
            })
        }
    )
    csl.log(std_size)


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
    var $ = function (tag) {
        return doc.querySelector(tag);
    }
    var $$=function(tag){
        return doc.querySelectorAll(tag);
    }
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
        var x = parseInt(i / column_sum);
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
    just_a_grid = $(".grid");
    csl.log(just_a_grid)
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

        var h = just_a_grid.clientHeight ;
        var w = just_a_grid.clientWidth;

        return [(pos[0] + 0.5) * h, (pos[1] + 0.5) * w]
    }

    function  hasChild(parent,child){
        while(child.parentElement){
            
//            console.log(child.parentNode)
            if(child.parentNode==parent)
                return true;
            child=child.parentElement;
        }
        return false;
    }

    miao_obj = function () {}
    miao_obj.prototype.init = function (kind, pos, other) {
        var d = $("#" + this.name + "_to_copy").cloneNode(true);
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

    Bul = function (kind, pos, target) {
        this.name = "bul"
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
            this.target.suffer(this.kind);
            this.unregister();
        } else {
            this.set_pos(pos);
        }
    }
    Tower = function (kind, pos) {
        this.name = "tower";
        this.init.apply(this, arguments);

        obj_add(this, {
            level: 0,
            base_trans: "translate(-50%, -50%)",
            prepare: 0,
            prepare_max: 30,
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
    Tower.prototype.rotate = function () {
        console.log(angle)
        this.style.transform = this.base_trans + " rotate(" + angle + "deg)";
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
                if (dis < towers[tower.kind][0]) {
                    tower.f_rotate(tower.pos[1] - e.pos[1], tower.pos[0] - e.pos[0])
                    if (tower.ready) {
                        var bul = new Bul(0, tower.pos, e);
                        tower.ready = false;
                        tower.prepare = 0;
                    }
                    return true;
                }
            }
        )
    }

    function bullet_create(kind, pos, target) {
        return new Bul(kind, pos, target);

    }

    function tower_create(kind, x, y) {
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
            return
        this.buls.forEach(
            function (b) {
                addClass(b.d, "trans")
            }
        )
        this.unregister();
    }
    Emy.prototype.suffer = function (kind) {
        this.hp -= towers[kind][1];
        this.bf.style.right = (1 - this.hp / this.hp_max) * 100 + "%";
        if (this.hp <= 0 && !this.dead) {
            this.destroy();
            this.dead = true;
        }
    }
    Emy.prototype.step = function () {
        if (!this.initted) //uninited
        {
            this.initted = true;
            this.set_pos(maps_start[level]);
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
            this.dead = true;
            //            this.unregister();
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

    function map_put(kind) {
        addClass(current_map.start_grid.querySelector(".startp"), "out");
        setTimeout(
            function () {
                removeClass(current_map.start_grid.querySelector(".startp"), "out");
            }, 500
        )
    }

    function put_emy(kind, pos) {
        map_put(kind);
        setTimeout(
            function () {
                var emy = emy_create(kind, pos);
            }, 300
        )

    }
    function clone_tpl(dom){
        dom=dom.cloneNode(true);
        removeClass(dom,"hide");
        removeClass(dom,"trans");
        dom.id="";
        return dom;
    }
    var catching_thing;
    mn.onmousemove=function(para){
//        console.log(para)
//        console.log(mn.style)
        if(typeof(catching_thing)!="undefined"){
            console.log("m")
            catching_thing.style.left=para.x;
            catching_thing.style.top=para.y;
        }
    }
    function put_tower(kind){
         catching_thing=clone_tpl($("#tower_to_copy[kind='"+kind+"']"));
        catching_thing.style["pointer-events"]="none";
        addClass(catching_thing,"catching");
        addClass($("body"),"catchthing");
//        addClass(catching_thing,"hide");
        $("body").appendChild(catching_thing);
    }
    
    mn.onmouseover=function(){
        if(mouseisinmn){//trigger something
            
        }
        else
        {
            mouseisinmn=true;
            console.log("enter");
            addClass(mn,"active")
            addClass($("body"),"active")
            removeClass($("body"),"inactive");
        }
           

    }
    mn.onmouseout=function(para){
        if(!hasChild(mn,para.toElement)){//really out
            mouseisinmn=false;
            console.log("leave");
            removeClass(mn,"active")
            removeClass($("body"),"active")
            addClass($("body"),"inactive")
            
        }

    }
    var maps_hp = [100, 120]
    var Map = function (level) {
        var m = this;
        this.side = "td";
        this.load_map(level);
        this.reversing = false;
        map = maps[level];
        this.hp = maps_hp[level];
        this.hp_max = this.hp;
        this.map_start = maps_start[level];
        this.map_end = maps_end[level];
        this.dirs = dirs_create(map, this.map_start, this.map_end);
        paths.push(clone(this.map_start));
        this.dirs.forEach(
            function (d) {
                paths.push(clone(paths.last()))
                spread_dir(function (dx, dy) {
                    point_add(paths.last(), [dx, dy])
                }, 1, d);
            }
        );
        if (this.side == "ta")
            this.ta_enter();
        else {
            this.td_enter();
        }




        tower_create(0, 5, 3);
        tower_create(0, 7, 3);
        tower_create(0, 6, 3);
    }
    Map.prototype.set_hp = function (hp) {
        this.hp = hp;
        if (this.hp <= 0)
            this.ta_finish();
        $(".endp>.fill").style.opacity = 0.2 + 0.8 * (this.hp_max - this.hp) / this.hp_max;
    }
    Map.prototype.suffer = function (emy) {
        this.set_hp(this.hp - emy.str);
    }
    Map.prototype.ta_enter = function () {
        var m = this;
        this.remove_things();
        left_panel.innerHTML = "";
        var tpl = $("#emy_panel_to_copy")
        emys.forEach(function (v, k) {
            var d = tpl.cloneNode(true);
            removeClass(d, "hide")
            d.onclick = function () {

                put_emy(k, m.map_start)
            }

            var emy = $("#emy_to_copy[kind='" + k + "']").cloneNode(true);
            removeClass(emy, "hide trans")
            console.log(emy)
            emy.id=""
            console.log(d, d.querySelector(".emy"))
            left_panel.appendChild(d);
            //                d.replaceChild(emy, d.querySelector(".top>.emy"));
            d.querySelector(".top").appendChild(emy)

        })

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
    }
    Map.prototype.td_enter = function () {
        var m = this;
        this.remove_things();


        left_panel.innerHTML = "";
        var tpl = $("#tower_panel_to_copy")
        towers.forEach(function (v, k) {
            var d = tpl.cloneNode(true);
            removeClass(d, "hide")
            d.onclick = function () {
                console.log("ss")
                put_tower(k, m.map_start)
            }

            var tower = $("#tower_to_copy[kind='" + k + "']").cloneNode(true);
            removeClass(tower, "hide")
            removeClass(tower,"trans")
            console.log(tower)
            tower.id=""
            left_panel.appendChild(d);
            d.querySelector(".top").appendChild(tower)
            d.querySelector(".bottom p").innerHTML=v[2];

        })
    }

    function reverse(dom) {
        console.log(dom)
        var rotate = "rotateY(180deg)";
        console.log(dom.style.transform.lastIndexOf(rotate))
        if (dom.style.transform.lastIndexOf(rotate) > -1) {
            console.log("replace", dom.style.transform)
            var temp = dom.style.transform;
            var sps = temp.split(" ")
            if (sps.length > 1)
                temp = sps[0]
            else
                temp = ""
                //            temp.replace(/rot/g,"s")
            console.log("temp", temp)
            dom.style.transform = temp;

        } else {
            console.log("+=", " " + dom.style.transform)
            dom.style.transform += rotate;
        }
        console.log("finish", dom.style.transform)
            //        dom.style.transform.replace("rotateY(180deg)","");
            //        dom.style.transform += "rotateY(180deg)";
    }
    Map.prototype.half_level_finish = function (state) {
        var m = this;

        if (this.reversing)
            return;
        else
            this.reversing = true;
        var endp = $(".endp>.fill")
        endp.style.transition = "transform " + dg("3.5", "0.1") + "s ease-in";
        if (state == "ta") {
            addClass(endp, "rotate")
        } else {
            removeClass(endp, "rotate")
        }

        setTimeout(
            function () {
                m.reversing = false;
            }, dg(4000, 0)
        )
        setTimeout(
            function () {

                reverse(my_panel);
                reverse(my_panel.querySelector(".ftr"))

                endp.style.transition = "transform " + dg("3.5", "0.1") + "s ease-out";
                removeClass(endp, "rotate")
            }, dg(3000, 0)
        )

        setTimeout(
            function () {
                reverse(left_panel);
                if (m.side == "ta") {
                    m.side = "td";
                    m.td_enter();
                } else {
                    m.side = "ta";
                    m.ta_enter();
                }
            }, dg(3300, 0)
        )
    }
    Map.prototype.ta_finish = function () {
        this.half_level_finish("ta");

    }
    Map.prototype.td_finish = function () {
        this.half_level_finish("td");
    }
    Map.prototype.load_map = function (level) {
        for (var row = 0; row < row_sum; row++) {
            var row_value = parseInt(maps[level][row], 2);
            for (var column = 0; column < column_sum; column++) {
                //                    grids[column][row].lang = get_bit(row_value, column_sum - column - 1) ? "wall" : "road";
                grids[column][row].lang = get_pos_value(maps[level], column, row) ? "wall" : "road";
            }
        }
        this.start_grid = grids[maps_start[level][0]][maps_start[level][1]]
        this.start_grid.lang = "start";
        this.start_grid.appendChild($("#startp_to_copy"))
        this.end_grid = grids[maps_end[level][0]][maps_end[level][1]];
        this.end_grid.lang = "end";
        this.end_grid.appendChild($("#endp_to_copy"))

    }
    Map.prototype.destroy = function () {}

    function enter_level(level) {
        if (current_map)
            if (current_map)
                current_map.destroy();
        current_map = new Map(level)
    }

    enter_level(0);


    function obj_step(e) {
        e.step();
    }

    start.onclick = function () {
        playing = !playing;
    }

    function set_global_speed(times) {
        global_speed = times;
    }
    speedfor1.onclick = function () {
        set_global_speed(1)
    }
    speedfor2.onclick = function () {
        set_global_speed(2)
    }
    speedfor4.onclick = function () {
        set_global_speed(4)
    }

    test_btn.onclick = function () {
        current_map.ta_finish();
    }

    function step() {
        if (playing) {

            if (!(sys_tick_cnt % 120)) {
                //                put_emy(0, map_start);
            }
            for (var i in miao_objs) {
                miao_objs[i].forEach(obj_step);
            }
            sys_tick_cnt++;
        }
        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);


}