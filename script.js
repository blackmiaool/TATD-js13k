window.onload = function () {
    g = {};
    var level = 0;
    var doc = document;
    var csl = console;
    var emys = [];
    var buls = [];
    var towers = [];
    var emy_tests = doc.getElementsByClassName("emy_tpl");
    var bul_test = doc.getElementsByClassName("bul");

    var fps=60;
    var emys_height = [];
    var emys_width = [];
    for (var i = 0; i < emy_tests.length; i++) {
        emys_height.push(emy_tests[i].offsetHeight)
        emys_width.push(emy_tests[i].offsetWidth)
    }

    var buls_height = [];
    var buls_width = [];
    for (var i = 0; i < bul_test.length; i++) {
        buls_height.push(bul_test[i].offsetHeight)
        buls_width.push(bul_test[i].offsetWidth)
    }
    var std_size={
        bul:[],
        tower:[],
        emy:[]
    }
    var names=["bul","tower","emy"];
    names.forEach(
        function(name,index){
            var d=doc.querySelectorAll("#"+name+"_to_copy");
            csl.log(d)
            names.forEach.call(d,function(dom){
                   std_size[name].push([dom.offsetWidth,dom.offsetHeight]); 
                })
        }
    )
    csl.log(std_size)

    var emy_blood=[
        100,200,300
    ]
     var bullet_damage=[
         30,50,90
     ]
    



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
        //        for (var i = this.length - 1; i >= 0; i--) {
        //            if (f(this[i])) return;
        //        }
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
        
        
        
        
        miao_obj=function(name,kind,pos,other){
            var d=$("#"+name+"_to_copy").cloneNode(true);
            this.d=d;
            this.d.id="";
            removeClass(d,"hide");
            this.style=d.style;
            this.kind=kind;
            this.name=name;
            this.set_pos(clone(pos));
            this.init.apply(this,arguments);
        } 
        
        miao_obj.prototype.set_pos=function(pos){
            this.pos = pos;
            var p = get_grid_pos(pos);
            p[0]-=std_size[this.name][this.kind][0]/2;
            p[1]-=std_size[this.name][this.kind][1]/2;
//            p[0] -= buls_width[this.kind ] / 2;
//            p[1] -= buls_height[this.kind ] / 2;
            
            this.style.transform = "translate(" + p[0] + "px," + p[1] + "px)";
        }
        
        miao_obj.prototype.register=function(){
            
        }
        miao_obj.prototype.unregister=function(){
            
        }
        
//        Bul2={};
//        Bul2.prototype=new miao_obj("bul");
//        Bul2.prototype.init=function(name,kind,pos,target){
//            this.target=target;
//        }
//        
        
        Bul = function (kind, pos, target) {
            var d = $("#bul_to_copy").cloneNode(true);
            this.d = d;
            this.d.id = undefined;
            removeClass(d, "hide")
                //            var style = d.style;
            this.style = d.style;
            this.kind = kind;
            this.set_pos(clone(pos));
            this.target = target;
            this.speed=10;
        }
        Bul.prototype.set_pos = function (pos) {

            this.pos = pos;
            var p = get_grid_pos(pos);
            p[0] -= buls_width[this.kind ] / 2;
            p[1] -= buls_height[this.kind ] / 2;
            this.style.transform = "translate(" + p[0] + "px," + p[1] + "px)";
//            csl.log(pos, "translate(" + p[0] + "px," + p[1] + "px)");
        }
        Bul.prototype.register = function () {
            buls.push(this)
        }
        Bul.prototype.unregister=function(){
            buls.remove(this);
            mn.removeChild(this.d)
        }
        Bul.prototype.cal_pos=function(src,target,speed){
            var dx=target[0]-src[0];
            var dy=target[1]-src[1];
//            var sum=m.abs(dx)+m.abs(dy);
            var dis=cal_dis(src,target);
            if(dis<=speed)
                return false;
            var sum=dis;
            src[0]+=(target[0]-src[0])/sum*speed;
            src[1]+=(target[1]-src[1])/sum*speed;            
            return src;
        }
        Bul.prototype.step = function () {
            var pos=this.cal_pos(this.pos,this.target.pos,this.speed/fps);
            if(!pos)
            {
                this.target.suffer(this.kind);
                this.unregister();
            }
            else
                this.set_pos(pos);
        }
        var bullet_create = function (kind, pos,target) {
            return new Bul(kind, pos,target);

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
            var base_trans = "translate(-50%, -50%)";
            var angle_filter = [];
            var angle_filter1 = [];
            var angle_filter2 = [];
            for (var i = 0; i < 10; i++) {
                angle_filter1[i] = 1;
                angle_filter2[i] = 1;
            }
            for (var i = 0; i < 2; i++) {
                angle_filter[i] = 0;
            }
            tower.rotate = function (angle) {
                console.log(angle)
                angle_filter.unshift(angle)
                angle_filter.pop();

                //                csl.log("rrot")
                console.log(angle_filter.average());
                style.transform = base_trans + " rotate(" + angle_filter.average() + "deg)";
            }
            tower.f_rotate = function (y, x) {
                //                console.log(x,y)
                angle_filter1.unshift(y)
                angle_filter1.pop();
                angle_filter2.unshift(x)
                angle_filter2.pop();
                //                console.log(angle_filter1.average(), angle_filter2.average())
                //                var angle = m.atan2(angle_filter1.average(), angle_filter2.average())
                //                console.log(angle);
                var angle = m.atan2(y, x);
                style.transform = base_trans + " rotate(" + (angle * 180 / m.PI + 90) + "deg)";
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
            tower.prepare = 0;
            var prepare_max = 30;
            tower.step = function () {
                if (!tower.ready) {
                    tower.prepare++;
                    if (tower.prepare > prepare_max) {
                        tower.ready = true;
//                        csl.log("ready")
                    }
                }

                emys.r_forEach(
                    function (e) {
//                        csl.log(e);
                        var dis = cal_dis(e.pos, tower.pos);
                        if (dis < tower_rage[tower.kind][tower.level]) {
                            tower.f_rotate(tower.pos[1] - e.pos[1], tower.pos[0] - e.pos[0])
//                            csl.log(tower.pos[1] - e.pos[1], tower.pos[0] - e.pos[0])
                            if (tower.ready) {
                                var bul = bullet_create(0, tower.pos, e);
                                bul.register()
                                mn.appendChild(bul.d);
                                tower.ready = false;
                                tower.prepare = 0;

                            }
                            return true;
                        }
                    }
                )
            }
            return tower;
        }

        function Emy(kind) {
            var d = emy_tests[kind].cloneNode(true);
            this.d = d;
            d.className = "emy";
            this.style = d.style;
            removeClass(d,"hide");
            this.is_continue = true;
            this.speed = 0.03;
            this.path_len = 0;
            this.pos = clone(map_start);
            this.initted = false;
            this.kind = kind;
            this.blood=emy_blood[kind];
            this.blood_max=emy_blood[kind];
            this.bf=d.querySelector(".fill");
            this.dead=false;
        }
        Emy.prototype.destroy=function(){
            this.unregister();
        }
        Emy.prototype.suffer=function(kind){
            this.blood-=bullet_damage[kind];
            this.bf.style.right=(1-this.blood/this.blood_max)*100+"%";
            if(this.blood<=0&&!this.dead){
                this.destroy();
                this.dead=true;
            }
            //set blood
        }
        Emy.prototype.set_pos = function (pos) {
            
            this.pos = pos;
            var p = get_grid_pos(pos);
            p[0] -= emys_width[this.kind] / 2;
            p[1] -= emys_height[this.kind] / 2;
            this.style.transform = "translate(" + p[0] + "px," + p[1] + "px)";
        }
        Emy.prototype.register = function () {
            emys.push(this);
        }
        Emy.prototype.unregister = function () {
            emys.remove(this);
            
            this.d.parentNode.removeChild(this.d)

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
            this.path_len += this.speed;
            var path_len_i = Math.floor(this.path_len)
            if (path_len_i >= dirs.length) {
                this.unregister();
                this.is_continue = false;
            }
            var pos_now = clone(paths[path_len_i]);
            spread_dir(function (dx, dy) {
                point_add(pos_now, [dx, dy])
            }, this.path_len - path_len_i, dirs[path_len_i])
            this.pos = pos_now;
            this.set_pos(pos_now);
        }
        emy_create = function (kind) {
            return new Emy(kind);
        }

        function put_tower(kind, x, y) {
            var tower = tower_create(kind, [x, y]);


            tower.register()

            mn.appendChild(tower);

        }

        function put_emy(kind) {
            var emy = emy_create(kind);


            emy.register()
            mn.appendChild(emy.d);

        }
        put_emy(0);
        setInterval(
            function () {
                put_emy(0);
            }, 2000
        )
        put_tower(0, 5, 3);
        put_tower(0, 7, 3);
        put_tower(0, 6, 3);
    }
    enter_level(0);
    var sys_tick_cnt = 0;

    function obj_step(e) {
        e.step();
    }
    var playing=true;
    start.onclick=function(){
        playing=!playing;
    }
    function step() {
        if(playing){
           sys_tick_cnt++;
        towers.forEach(obj_step)
        emys.forEach(obj_step)
        buls.forEach(obj_step); 
        }
        

        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);


}