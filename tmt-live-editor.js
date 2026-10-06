// ==UserScript==
// @name         TMT Live Editor（TMT 实时编辑器）
// @namespace    chenf888/tmt-live-editor
// @version      1.3.1
// @description  注入式油猴插件：在任意 The Modding Tree 引擎的增量游戏（2.5.x / 2.6.x，含 Prestige Tree Rewritten）上启用实时编辑系统。点击界面直接修改文本/数值，添加组件，自由拖拽布局中的一切，导出/导入编辑记录。检测到改版引擎（自带 editable）的页面会自动跳过。
// @author       chenf888
// @match        *://*/*
// @match        file:///*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @inject-into  auto
// @license      MIT
// ==/UserScript==



(function () {
	"use strict";

	const W = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
	const IN_SANDBOX = typeof unsafeWindow !== "undefined";

	
	
	function __tmtLivePageCode() {


if (typeof mod === "undefined") mod = {}


const tmtI18N = {
    zh: {
        addToLayer: "添加组件到图层「{L}」", insertBefore: "（插入到第 {N} 项之前）",
        cancel: "取消", add: "添加", content: "内容", htmlLabel: "HTML", initialText: "初始文字", titleLabel: "标题",
        addToEnd: "加到末尾", addToFront: "加到最前面",
        t_displayText: "显示文本（可写 HTML）", t_rawHtml: "网页 HTML（富内容）",
        t_upgrades: "升级列表", t_milestones: "里程碑列表", t_challenges: "挑战列表",
        t_clickables: "可点击物列表", t_buyables: "可购买物列表", t_achievements: "成就列表",
        t_bar: "进度条（自动创建定义）", t_infobox: "信息框（自动创建定义）",
        t_mainDisplay: "主显示（货币数量+资源名）", t_prestigeButton: "重置按钮",
        t_resourceDisplay: "资源详情显示", t_blank: "空白间隔", t_hLine: "水平线", t_vLine: "垂直线",
        tpl_newComponent: "新组件", tpl_newHtml: "<b>新组件</b>", tpl_barText: "50%", tpl_barDisplay: "0%",
        tpl_newUpgrade: "新升级", tpl_upgradeDesc: "在这里写描述", tpl_newMilestone: "新里程碑",
        tpl_milestoneEffect: "解锁效果", tpl_newChallenge: "新挑战", tpl_challengeDesc: "挑战描述",
        tpl_rewardDesc: "奖励描述", tpl_newClickable: "新可点击物", tpl_clickMe: "点我",
        tpl_newBuyable: "新可购买物", tpl_buyableDesc: "描述", tpl_newAchievement: "新成就",
        tpl_newInfobox: "新信息框", tpl_infoboxBody: "（点击正文可直接编辑）",
        tpl_newItem: "新条目", tpl_newContent: "新内容",
        m_noLayer: "找不到图层：", m_unknownType: "不认识的组件类型：", m_fnParseFail: "函数解析失败：检查括号/语法",
        m_badNumber: "不是数字", m_writeFail: "写入失败：", m_enterLayerFirst: "先进入一个图层页面，再添加组件",
        m_copied: "已复制", m_layerJsCopied: "layer.js 已复制", m_pasteJson: "粘贴编辑 JSON：",
        m_confirmClear: "确定清除本站全部实时编辑？", m_togglePanel: "TMT Live：显示/隐藏编辑面板", m_toggleLang: "切换到 English",
        b_editor: "结构编辑器", b_add: "添加组件", b_export: "导出编辑", b_exportJs: "导出 layer.js",
        b_import: "导入编辑", b_clear: "清除编辑", b_lang: "EN", b_layout: "自由布局",
        l_title: "自由拖拽布局", l_stateOn: "布局模式：开", l_stateOff: "布局模式：关",
        l_hint: "拖动页面上任意元素即可移动；[ ] 调抓取层级；按住 Shift 按 8px 吸附；双击复位；Esc 退出",
        l_grab: "抓取层级 {N}", l_moved: "已移动 {N} 个元素",
        l_hintEl: "当前：{S}", l_hintNone: "当前：没有选中元素",
        l_btnPanel: "布局记录", l_btnReset: "复位", l_btnFloat: "浮动", l_btnLocate: "定位",
        l_btnExit: "退出布局模式", l_btnResetAll: "全部复位",
        l_p_title: "布局记录（{N}）", l_p_empty: "还没有移动过任何元素。",
        l_p_hint: "「浮动」会让元素脱离原来的布局位置（绝对定位），周围内容可能跟着挪动；随时可以复位。",
        l_p_off: "{X}, {Y}", l_p_zero: "原位", l_p_floatOn: "浮动", l_p_gone: "元素当前不存在",
        l_p_clear: "清空布局",
        l_m_reset: "已复位", l_m_resetAll: "布局已全部复位", l_m_cleared: "布局记录已清空",
        m_confirmClearLayout: "确定清空全部布局记录？页面会回到原始布局。",
        m_confirmResetAllLayout: "确定把所有元素的位移全部复位？",
        e_layer: "图层：", e_expandAll: "展开全部", e_collapseAll: "收起全部", e_close: "关闭",
        e_addField: "＋字段", e_addItem: "＋条目", e_fnHint: "ƒ 函数（点击展开改源码）", e_saveFn: "保存函数",
        e_arrItems: "数组 {N} 项", e_objFields: "对象 {N} 字段", e_empty: "（空）",
        e_saved: "已保存", e_deleted: "已删除", e_fnNotSaved: "函数没保存", e_fnSaved: "函数已保存",
        e_confirmDelete: "删除 {K} ？", e_newFieldName: "新字段名", e_newFieldType: "类型：text / num / bool / dec / fn / obj / arr",
        e_overwrite: "字段 {K} 已存在，覆盖它？", e_layerMissing: "图层不存在",
        e_clickToEnter: "点击输入文字", e_itemCreated: "已新建条目",
        e_insertAfter: "在这个条目后面插入组件", e_deleteTip: "删除",
        m_importPrompt: "粘贴编辑 JSON：", m_legacyConfirm: "这份编辑不是安全格式（{E}）。\n继续导入将使用旧方式（eval），可能执行任意代码！\n只在你完全信任来源时继续。",
        m_importFail: "导入失败：", m_tooBig: "这份编辑太大了", m_badFormat: "这不是 TMT Live 编辑文件",
        m_confirmDeleteMod: "确定删除模组吗？你将失去这个模组！", m_imported: "已导入",
        m_tooDeepTree: "这树有够深的", m_symbolInTree: "为什么你树里有symbol啊？", m_somethingWrong: "肯定是哪里有问题",
        x_tooDeep: "编辑内容嵌套太深", x_unknownData: "不认识的数据：", x_badDecimal: "坏的 Decimal", x_badFunction: "坏的函数",
        x_fnNotExportable: "有函数无法被安全地导出（{E}），这份编辑不能用安全方式导入",
        x_unknownTag: "不认识的标记：", x_fnUnparseable: "无法解析的函数",
        c_detected: "TMT 引擎已识别（Vue {V}，funcs: {F}），开始注入", c_hooked: "已挂钩 Vue.component",
        c_patchedRunning: "运行中注入，已改造组件：", c_skipFork: "检测到改版引擎，跳过注入",
        c_done: "注入完成：点击界面上的标题/描述等文本即可编辑；添加组件在右下角面板里",
        c_applySaved: "已应用持久化的编辑", c_ignoreLayer: "[TMT-Live] 忽略未知图层：", c_editorBtn: "结构编辑器（改任意字段）",
        c_preApplyFail: "预应用编辑失败", c_applyFail: "应用编辑失败",
        infoboxBodyHint: "（点击正文可直接编辑）",
    },
    en: {
        addToLayer: "Add component to layer \"{L}\"", insertBefore: "(insert before item {N})",
        cancel: "Cancel", add: "Add", content: "Content", htmlLabel: "HTML", initialText: "Initial text", titleLabel: "Title",
        addToEnd: "Add to end", addToFront: "Add to front",
        t_displayText: "Display text (HTML allowed)", t_rawHtml: "Raw HTML (rich content)",
        t_upgrades: "Upgrades", t_milestones: "Milestones", t_challenges: "Challenges",
        t_clickables: "Clickables", t_buyables: "Buyables", t_achievements: "Achievements",
        t_bar: "Progress bar (auto-created)", t_infobox: "Info box (auto-created)",
        t_mainDisplay: "Main display (currency + resource)", t_prestigeButton: "Prestige button",
        t_resourceDisplay: "Resource display", t_blank: "Blank space", t_hLine: "Horizontal line", t_vLine: "Vertical line",
        tpl_newComponent: "New component", tpl_newHtml: "<b>New component</b>", tpl_barText: "50%", tpl_barDisplay: "0%",
        tpl_newUpgrade: "New upgrade", tpl_upgradeDesc: "Write your description here", tpl_newMilestone: "New milestone",
        tpl_milestoneEffect: "Unlock effect", tpl_newChallenge: "New challenge", tpl_challengeDesc: "Challenge description",
        tpl_rewardDesc: "Reward description", tpl_newClickable: "New clickable", tpl_clickMe: "Click me",
        tpl_newBuyable: "New buyable", tpl_buyableDesc: "Description", tpl_newAchievement: "New achievement",
        tpl_newInfobox: "New info box", tpl_infoboxBody: "(click to edit this text)",
        tpl_newItem: "New item", tpl_newContent: "New content",
        m_noLayer: "Layer not found: ", m_unknownType: "Unknown component type: ", m_fnParseFail: "Failed to parse function: check brackets/syntax",
        m_badNumber: "Not a number", m_writeFail: "Write failed: ", m_enterLayerFirst: "Enter a layer page before adding components",
        m_copied: "Copied", m_layerJsCopied: "layer.js copied", m_pasteJson: "Paste edit JSON:",
        m_confirmClear: "Clear ALL live edits saved on this site?", m_togglePanel: "TMT Live: show/hide editor panel", m_toggleLang: "Switch to 中文",
        b_editor: "Structure editor", b_add: "Add component", b_export: "Export edits", b_exportJs: "Export layer.js",
        b_import: "Import edits", b_clear: "Clear edits", b_lang: "中文", b_layout: "Drag layout",
        l_title: "Drag-to-arrange layout", l_stateOn: "Layout mode: ON", l_stateOff: "Layout mode: OFF",
        l_hint: "Drag anything on the page to move it; [ ] changes grab level; hold Shift to snap to 8px; double-click to reset; Esc to exit",
        l_grab: "Grab level {N}", l_moved: "{N} elements moved",
        l_hintEl: "Target: {S}", l_hintNone: "Target: nothing under the cursor",
        l_btnPanel: "Layout records", l_btnReset: "Reset", l_btnFloat: "Float", l_btnLocate: "Locate",
        l_btnExit: "Exit layout mode", l_btnResetAll: "Reset all",
        l_p_title: "Layout records ({N})", l_p_empty: "Nothing has been moved yet.",
        l_p_hint: "\"Float\" takes the element out of the normal flow (absolute positioning), which can shift the surrounding layout; reset any time.",
        l_p_off: "{X}, {Y}", l_p_zero: "in place", l_p_floatOn: "floating", l_p_gone: "element not on screen",
        l_p_clear: "Clear layout",
        l_m_reset: "Reset", l_m_resetAll: "All offsets reset", l_m_cleared: "Layout records cleared",
        m_confirmClearLayout: "Clear all layout records? The page goes back to the original layout.",
        m_confirmResetAllLayout: "Reset the offset of every moved element?",
        e_layer: "Layer: ", e_expandAll: "Expand all", e_collapseAll: "Collapse all", e_close: "Close",
        e_addField: "+field", e_addItem: "+item", e_fnHint: "ƒ function (click to edit source)", e_saveFn: "Save function",
        e_arrItems: "array, {N} items", e_objFields: "object, {N} fields", e_empty: "(empty)",
        e_saved: "Saved", e_deleted: "Deleted", e_fnNotSaved: "Function not saved", e_fnSaved: "Function saved",
        e_confirmDelete: "Delete {K} ?", e_newFieldName: "New field name", e_newFieldType: "Type: text / num / bool / dec / fn / obj / arr",
        e_overwrite: "Field {K} already exists. Overwrite?", e_layerMissing: "Layer does not exist",
        e_clickToEnter: "Click to enter text", e_itemCreated: "Item created",
        e_insertAfter: "Insert a component after this item", e_deleteTip: "Delete",
        m_importPrompt: "Paste edit JSON:", m_legacyConfirm: "These edits are not in the safe format ({E}).\nContinuing uses the legacy method (eval) which may execute arbitrary code!\nOnly continue if you fully trust the source.",
        m_importFail: "Import failed: ", m_tooBig: "These edits are too large", m_badFormat: "This is not a TMT Live edit file",
        m_confirmDeleteMod: "Are you sure you want to delete the mod? You will lose the mod!", m_imported: "Imported",
        m_tooDeepTree: "This tree is way too deep", m_symbolInTree: "Why does your tree have a symbol in it?", m_somethingWrong: "Something must be wrong",
        x_tooDeep: "Edits are nested too deeply", x_unknownData: "Unrecognized data: ", x_badDecimal: "Bad Decimal", x_badFunction: "Bad function",
        x_fnNotExportable: "A function could not be exported safely ({E}); these edits cannot be imported the safe way",
        x_unknownTag: "Unknown tag: ", x_fnUnparseable: "Unparseable function",
        c_detected: "TMT engine detected (Vue {V}, funcs: {F}), injecting", c_hooked: "Vue.component hooked",
        c_patchedRunning: "Runtime injection, patched components: ", c_skipFork: "Modded engine with built-in editor detected, skipping",
        c_done: "Injected: click titles/descriptions on the page to edit them; add components from the bottom-right panel",
        c_applySaved: "Applied saved edits", c_ignoreLayer: "[TMT-Live] ignoring unknown layer: ", c_editorBtn: "Structure editor (edit any field)",
        c_preApplyFail: "Failed to pre-apply edits", c_applyFail: "Failed to apply edits",
        infoboxBodyHint: "(click to edit this text)",
    },
};
function tmtT(key, rep){
    let lang=null;
    try{ lang=localStorage.getItem("tmtlive_lang"); }catch(e){}
    if(!tmtI18N[lang]) lang=(typeof navigator!=="undefined"&&/^zh/i.test(navigator.language||""))?"zh":"en";
    let s=(tmtI18N[lang]&&tmtI18N[lang][key]!==undefined)?tmtI18N[lang][key]:tmtI18N.zh[key];
    if(s===undefined)s=key;
    if(rep)for(const k in rep)s=s.replace("{"+k+"}",rep[k]);
    return s;
}
function tmtToggleLang(){
    let cur=null;
    try{ cur=localStorage.getItem("tmtlive_lang"); }catch(e){}
    const next=(cur==="en")?"zh":(cur==="zh")?"en":((typeof navigator!=="undefined"&&/^zh/i.test(navigator.language||""))?"en":"zh");
    try{ localStorage.setItem("tmtlive_lang",next); }catch(e){}
    return next;
}

function editableOnFocus(ptr){
    let p=mod,m=tmp,f=(typeof funcs!=="undefined"&&funcs)?funcs:null,l=layers;
    const a=ptr.__vue__.ptr.split("-"),t=a.pop();
    for(i of a){
        if(p[i]==null)p[i]={};
        if(m[i]==null)return;
        if(f){if(f[i]==null)f={};}
        if(l[i]==null)return;
        p=p[i],m=m[i];
        if(f)f=f[i];
        l=l[i];
    }
    if((f&&f[t])||typeof m[t]==="function"){
        ptr.innerText=l[t];
        Object.assign(ptr.style,({
            position: "relative",
            zIndex: 1,
            float: "inline-start",
            textAlign: "left",
            backgroundColor: "#000",
            color: "#0f0",
            outline: "#fff dashed 1px",
        }))
    }
    else ptr.innerHTML=l[t]==''?tmtT("e_clickToEnter"):l[t];
}

function editableOnBlur(ptr){
    let p=mod,m=tmp,f=(typeof funcs!=="undefined"&&funcs)?funcs:null,l=layers;
    const a=ptr.__vue__.ptr.split("-"),t=a.pop();
    for(i of a){
        if(p[i]==null)p[i]={};
        if(m[i]==null)return;
        if(f){if(f[i]==null)f={};}
        if(l[i]==null)return;
        p=p[i],m=m[i];
        if(f)f=f[i];
        l=l[i];
    }
    if((f&&f[t])||typeof m[t]==="function"){
        let e;
        try{
            e=eval(`({${ptr.innerText}})`)
        }catch(err){
            ptr.innerText=ptr.__vue__.data;
            ptr.style={};
            return;
        }
        ptr.innerText=ptr.__vue__.data;
        
        
        for(const k in e){
            p[k]=l[k]=e[k];
            if(f)f[k]=e[k];
        }
        ptr.style={};
    }
    else if(m[t] instanceof Decimal){
        const d=new Decimal(ptr.innerHTML);
        if(d.mag!==d.mag)return;
        p[t]=m[t]=l[t]=d;
        ptr.innerHTML=ptr.__vue__.data;
    }
    else if(typeof m[t]==="number"){
        const num=Number(ptr.innerHTML);
        if(num!==num)return;
        p[t]=m[t]=l[t]=num;
        ptr.innerHTML=ptr.__vue__.data;
    }
    else p[t]=m[t]=l[t]=ptr.innerHTML,ptr.innerHTML=ptr.__vue__.data;
    
    if(ptr.innerHTML=='')ptr.innerHTML=tmtT("e_clickToEnter");
}


function deleteMod(){
	if (!confirm(tmtT("m_confirmDeleteMod"))) return
    mod={};
    save();
    delete window.save;
    delete window.onbeforeunload;
    localStorage.removeItem(getModID()+"_mod")
    localStorage.removeItem("tmtlive_"+getModID()+"_mod")
    window.location.reload();
}



function modstringify(obj,maxdep=32,dep=0,key=""){
    if(dep>maxdep){
        alert(tmtT("m_tooDeepTree"))
        return "'...'";
    }
    if(obj instanceof Decimal)
        return `Decimal.fromComponents(${obj.sign},${obj.layer},${obj.mag})`
    if(obj==null)
        return obj+"";

    switch(typeof obj){
        case "string":
        case "boolean":
        case "number":
            return JSON.stringify(obj);
        case "bigint":
            return `${obj}n`;
        case "object":
            let ret="";
            if(Array.isArray(obj)){
                for(i in obj){
                    let r;
                    if(typeof obj[i]==='function'&&!/^([a-zA-Z_]\w*|\(.*\))=>|^function/.test(obj[i]))
                        ret+=`${"\t".repeat(dep+1)}${obj[i]},\n`;
                    else ret+=`${"\t".repeat(dep+1)}${modstringify(obj[i],maxdep,dep+1,i)},\n`;
                }return `[\n${ret}${"\t".repeat(dep)}]`;
            }
            else{
                for(i in obj){
                    let r;
                    if(typeof obj[i]==='function'&&!/^([a-zA-Z_]\w*|\(.*\))=>|^function/.test(obj[i]))
                        ret+=`${"\t".repeat(dep+1)}${obj[i]},\n`;
                    else ret+=`${"\t".repeat(dep+1)}"${i}": ${modstringify(obj[i],maxdep,dep+1,i)},\n`;
                }return `{\n${ret}${"\t".repeat(dep)}}`;
            }
        case "function":
            if(/^([a-zA-Z_]\w*|\(.*\))=>|^function/.test(obj))
                return obj.toString();
            else
                return "function "+obj.toString();

        case "symbol":
            alert(tmtT("m_symbolInTree"));
            
        default:
            alert(tmtT("m_somethingWrong"));
    }
    return String(obj);
}

function get_layer_js(){
    const layerNames=(typeof LAYERS!=="undefined"&&LAYERS)?LAYERS:Object.keys(layers);
    let layer_js="//layers:"+layerNames+"\n";
    for(i of layerNames){
        layer_js+=`
//Layer ${i}
addLayer(${JSON.stringify(i)},${modstringify(layers[i])})


        `
    }
    return layer_js;
}









function tmtScanCode(src, startPos, closeChars){
    const open={"(":")","[":"]","{":"}"};
    const keywords=/^(return|typeof|case|in|of|new|delete|void|instanceof|do|else|yield|await)$/;
    let depth=[],i=startPos,prev="";
    
    const startCh=src[startPos];
    const initialClose=startCh&&open.hasOwnProperty(startCh)?open[startCh]:null;
    while(i<src.length){
        const c=src[i];
        if(c==='"'||c==="'"){
            i++;
            while(i<src.length&&src[i]!==c){if(src[i]==="\\")i++;i++;}
            if(i>=src.length)return -1;
            i++;prev="x";continue;
        }
        if(c==="`"){
            i++;
            while(i<src.length){
                if(src[i]==="\\"){i+=2;continue;}
                if(src[i]==="`")break;
                if(src[i]==="$"&&src[i+1]==="{"){
                    const close=tmtScanCode(src,i+1,"}");
                    if(close<0)return -1;
                    i=close+1;continue;
                }
                i++;
            }
            if(i>=src.length)return -1;
            i++;prev="x";continue;
        }
        if(c==="/"&&src[i+1]==="/"){while(i<src.length&&src[i]!=="\n")i++;continue;}
        if(c==="/"&&src[i+1]==="*"){
            const end=src.indexOf("*/",i+2);
            if(end<0)return -1;
            i=end+2;continue;
        }
        if(c==="/"){
            
            const word=src.slice(Math.max(0,i-15),i).replace(/\s+$/,"").match(/[A-Za-z_$]+$/);
            if(prev===""||"([,=:[!&|?{};+*-^%~<>".includes(prev)||(word&&keywords.test(word[0]))){
                i++;
                let inClass=false;
                while(i<src.length){
                    if(src[i]==="\\"){i+=2;continue;}
                    if(src[i]==="[")inClass=true;
                    else if(src[i]==="]")inClass=false;
                    else if(src[i]==="/"&&!inClass)break;
                    else if(src[i]==="\n")return -1;
                    i++;
                }
                if(i>=src.length)return -1;
                i++;
                while(i<src.length&&/[a-z]/i.test(src[i]))i++;
                prev="x";continue;
            }
            
        }
        if(open[c]){depth.push(open[c]);i++;prev=c;continue;}
        if(c==="}"||c==="]"||c===")"){
            if(depth.length===0){
                if(!initialClose)return closeChars.includes(c)?i:-1;
                return -1;
            }
            if(depth.pop()!==c)return -1;
            if(initialClose&&depth.length===0)return c===initialClose?i:-1;
            i++;prev=c;continue;
        }
        if(/\s/.test(c)){i++;continue;}
        prev=c;i++;
    }
    return -1;
}


function tmtParseFn(src){
    let m=src.match(/^(async\s+)?function\s*(\*?)\s*([A-Za-z_$][\w$]*)?\s*\(/);
    let isAsync=0,isGen=0,name="",params=0;
    if(m){
        isAsync=m[1]?1:0;isGen=m[2]?1:0;name=m[3]||"";params=m[0].length-1;
    }
    else{
        m=src.match(/^(async\s*)\(/);
        if(m){isAsync=1;params=m[0].length-1;}
        else{
            m=src.match(/^\*(\s*)([A-Za-z_$][\w$]*)?\s*\(/);
            if(m){isGen=1;params=m[0].length-1;name=m[2]||"";}
            else{
                m=src.match(/^([A-Za-z_$][\w$]*)\s*(\*)?\s*\(/);
                if(m){name=m[1];isGen=m[2]?1:0;params=m[0].length-1;}
                else{
                    m=src.match(/^(async\s+)?([A-Za-z_$][\w$]*)\s*=>/);
                    if(m){
                        return {isAsync:m[1]?1:0,isGen:0,name:"",params:m[2],
                            body:"return ("+src.slice(m[0].length)+");"};
                    }
                    if(src[0]!=="(")return null;
                    params=0;
                }
            }
        }
    }
    
    const paramsClose=tmtScanCode(src,params,")");
    if(paramsClose<0)return null;
    const paramsText=src.slice(params+1,paramsClose);
    let rest=src.slice(paramsClose+1).trim();
    let body;
    if(rest.startsWith("=>")){
        rest=rest.slice(2).trim();
        if(rest[0]==="{"){body=rest.slice(1);}
        else return {isAsync,isGen,name,params:paramsText,body:"return ("+rest+");"};
    }else if(rest[0]==="{"){body=rest.slice(1);}
    else return null;
    const bodyClose=tmtScanCode(body,0,"}]");
    if(bodyClose<0)return null;
    if(body.slice(bodyClose+1).trim()!=="")return null;
    return {isAsync,isGen,name,params:paramsText,body:body.slice(0,bodyClose)};
}


function tmtBuildFn(parsed){
    if(parsed.isAsync)return new Function("return async function("+parsed.params+"){"+parsed.body+"}")();
    if(parsed.isGen)return new Function("return function*("+parsed.params+"){"+parsed.body+"}")();
    return new Function(parsed.params,parsed.body);
}

function tmtSplitFn(fn){
    let src;
    try{src=Function.prototype.toString.call(fn).trim();}catch(e){return null;}
    return tmtParseFn(src);
}

function tmtEncodeValue(value,maxdep=32,dep=0){
    if(dep>maxdep)return {"@@tooDeep":true};
    if(value===undefined)return null;
    if(value===null||typeof value==="string"||typeof value==="boolean"||typeof value==="number")return value;
    if(value instanceof Decimal)return {"@@dec":[value.sign,value.layer,value.mag]};
    const t=typeof value;
    if(t==="function"){
        const split=tmtSplitFn(value);
        if(!split)return {"@@fnErr":tmtT("x_fnUnparseable")};
        return {"@@fn":{n:split.name,p:split.params,b:split.body,a:split.isAsync,g:split.isGen}};
    }
    if(t==="bigint")return String(value);
    if(Array.isArray(value))return value.map(v=>tmtEncodeValue(v,maxdep,dep+1));
    if(t==="object"){
        const out={};
        for(const k in value)out[k]=tmtEncodeValue(value[k],maxdep,dep+1);
        return out;
    }
    return String(value);
}

function modToJSON(obj){
    return JSON.stringify({"__TMTLIVE__":2,"data":tmtEncodeValue(obj)});
}

function tmtDecodeValue(value,maxdep=32,dep=0){
    if(dep>maxdep)throw new Error(tmtT("x_tooDeep"));
    if(value===null||typeof value==="string"||typeof value==="boolean"||typeof value==="number")return value;
    if(Array.isArray(value))return value.map(v=>tmtDecodeValue(v,maxdep,dep+1));
    if(typeof value!=="object")throw new Error(tmtT("x_unknownData")+typeof value);
    if(value["@@"+"dec"]!==undefined){
        const c=value["@@"+"dec"];
        if(!Array.isArray(c)||c.length!==3||!c.every(x=>typeof x==="number"&&isFinite(x)))throw new Error(tmtT("x_badDecimal"));
        return Decimal.fromComponents(c[0],c[1],c[2]);
    }
    if(value["@@"+"fn"]!==undefined){
        const f=value["@@"+"fn"];
        if(typeof f!=="object"||f===null||typeof f.p!=="string"||typeof f.b!=="string")throw new Error(tmtT("x_badFunction"));
        
        const built=tmtBuildFn({isAsync:!!f.a,isGen:!!f.g,params:f.p,body:f.b});
        if(f.n&&typeof f.n==="string"){try{Object.defineProperty(built,"name",{value:f.n});}catch(e){}}
        return built;
    }
    if(value["@@"+"fnErr"]!==undefined)throw new Error(tmtT("x_fnNotExportable",{E:value["@@"+"fnErr"]}));
    if(value["@@"+"tooDeep"]!==undefined)throw new Error(tmtT("x_tooDeep"));
    const out={};
    for(const k in value){
        if(k.startsWith("@@"))throw new Error(tmtT("x_unknownTag")+k);
        out[k]=tmtDecodeValue(value[k],maxdep,dep+1);
    }
    return out;
}

function modFromJSON(str){
    const parsed=JSON.parse(str);
    if(typeof parsed!=="object"||parsed===null||parsed.__TMTLIVE__!==2)throw new Error(tmtT("m_badFormat"));
    return tmtDecodeValue(parsed.data);
}


function importModString(str){
    if(!str)return false;
    if(str.length>2*1024*1024){alert(tmtT("m_tooBig"));return false;}
    try{
        const edits=modFromJSON(str);
        mod=edits;
        return applyEdits(edits);
    }catch(e){
        if(!confirm(tmtT("m_legacyConfirm",{E:e.message})))return false;
        try{
            const edits=eval("("+str+")");
            mod=edits;
            return applyEdits(edits);
        }catch(e2){alert(tmtT("m_importFail")+e2.message);return false;}
    }
}




function tmtRepairBars(){
    if(typeof layers==="undefined"||!layers)return;
    const fix=(bar)=>{
        if(!bar||typeof bar.display!=="function")return false;
        let broken=false;
        try{bar.display.call(bar);}catch(e){broken=true;}
        if(!broken)return false;
        if(typeof bar.text!=="string")bar.text=tmtT("tpl_barText");
        bar.display=function(){return this&&this.text!==undefined?this.text:"";};
        return true;
    };
    for(const layer in layers){
        if(layers[layer].bars){
            for(const id in layers[layer].bars)fix(layers[layer].bars[id]);
        }
        if(typeof mod!=="undefined"&&mod&&mod[layer]&&mod[layer].bars){
            for(const id in mod[layer].bars)fix(mod[layer].bars[id]);
        }
    }
}


function tmtRawDelete(root,path){
    let node=root;
    for(let i=0;i<path.length-1;i++){
        if(node==null)return;
        node=node[path[i]];
    }
    if(node==null)return;
    const last=path[path.length-1];
    if(Array.isArray(node))node.splice(Number(last),1);
    else if(typeof Vue!=="undefined"&&Vue.delete)Vue.delete(node,last);
    else delete node[last];
}


function applyEdits(edits){
    if(typeof edits!=="object"||edits===null)return false;
    
    const decoded=tmtDecodeValue(tmtEncodeValue(edits));
    
    const safe={};
    for(const k in decoded){
        
        if(k.slice(0,2)==="__")continue;
        if(k in layers)safe[k]=decoded[k];
        else if(typeof console!=="undefined"&&console.warn)console.warn(tmtT("c_ignoreLayer")+k);
    }
    if(typeof fixData==="function")fixData(layers,safe);
    for(const k in safe)layers[k]=safe[k];
    
    if(typeof mod!=="undefined"&&mod&&Array.isArray(mod.__del)){
        for(const p of mod.__del){
            if(!Array.isArray(p)||!layers[p[0]])continue;
            tmtRawDelete(layers[p[0]],p.slice(1));
            if(typeof tmp!=="undefined"&&tmp&&tmp[p[0]])tmtRawDelete(tmp[p[0]],p.slice(1));
            if(typeof funcs!=="undefined"&&funcs&&funcs[p[0]])tmtRawDelete(funcs[p[0]],p.slice(1));
        }
    }
    if(typeof tmp!=="undefined"&&tmp){
        tmtSyncTree(tmp,safe,true);
        if(typeof funcs!=="undefined"&&funcs)tmtSyncTree(funcs,safe,false);
        
        for(const k in safe){
            if(safe[k]&&safe[k].tabFormat!==undefined)tmtSyncTabFormat(k);
            
            if(safe[k]&&(safe[k].bars!==undefined||safe[k].infoboxes!==undefined)&&tmp[k]){
                for(const cont of ["bars","infoboxes"]){
                    if(safe[k][cont]===undefined)continue;
                    if(tmp[k][cont]===undefined)tmtSet(tmp[k],cont,{});
                    for(const id in safe[k][cont])tmtSet(tmp[k][cont],id,safe[k][cont][id]);
                    if(cont==="infoboxes"&&typeof player!=="undefined"&&player){
                        if(player.infoboxes===undefined)player.infoboxes={};
                        if(player.infoboxes[k]===undefined)player.infoboxes[k]={};
                    }
                }
            }
        }
        if(typeof updateTemp==="function")updateTemp();
        if(typeof updateTabFormats==="function")updateTabFormats();
    }
    tmtRepairBars();
    
    if(typeof tmtLayoutInvalidate==="function")tmtLayoutInvalidate();
    return true;
}

function tmtSyncTree(target,edits,writeData){
    for(const k in edits){
        const v=edits[k];
        if(typeof v==="function"){
            if(!writeData&&k in target)target[k]=v;
            continue;
        }
        if(v!==null&&typeof v==="object"){
            
            
            if(!(k in target))tmtSet(target,k,Array.isArray(v)?[]:{});
            if(target[k]!==null&&typeof target[k]==="object")tmtSyncTree(target[k],v,writeData);
            continue;
        }
        if(writeData&&k in target)target[k]=v;
    }
}


let tmtInsertIndex=-1;


function tmtComponentTypes(){
    return [
        ["display-text",tmtT("t_displayText"),true,tmtT("content")],
        ["raw-html",tmtT("t_rawHtml"),true,tmtT("htmlLabel")],
        ["upgrades",tmtT("t_upgrades"),false,""],
        ["milestones",tmtT("t_milestones"),false,""],
        ["challenges",tmtT("t_challenges"),false,""],
        ["clickables",tmtT("t_clickables"),false,""],
        ["buyables",tmtT("t_buyables"),false,""],
        ["achievements",tmtT("t_achievements"),false,""],
        ["bar",tmtT("t_bar"),true,tmtT("initialText")],
        ["infobox",tmtT("t_infobox"),true,tmtT("titleLabel")],
        ["main-display",tmtT("t_mainDisplay"),false,""],
        ["prestige-button",tmtT("t_prestigeButton"),false,""],
        ["resource-display",tmtT("t_resourceDisplay"),false,""],
        ["blank",tmtT("t_blank"),false,""],
        ["h-line",tmtT("t_hLine"),false,""],
        ["v-line",tmtT("t_vLine"),false,""],
    ];
}


function tmtBuildEntry(layer,type,content){
    if(type==="display-text")return {entry:["display-text",(content!==undefined&&content!==null&&content!=="")?content:tmtT("tpl_newComponent")]};
    if(type==="raw-html")return {entry:["raw-html",(content!==undefined&&content!==null&&content!=="")?content:tmtT("tpl_newHtml")]};
    if(type==="bar"){
        
        let n=11;
        if(layers[layer].bars===undefined)layers[layer].bars={};
        while(layers[layer].bars[String(n)]!==undefined)n++;
        const id=String(n);
        layers[layer].bars[id]={
            unlocked:true,
            direction:(typeof DEFAULT!=="undefined")?DEFAULT:0,
            width:300,height:30,
            progress:0,
            text:(content!==undefined&&content!==null&&content!=="")?content:tmtT("tpl_barText"),
            
            
            display(){return this&&this.text!==undefined?this.text:"";},
            fillStyle:{'background-color':'#00b52c'},
            textStyle:{'color':'#ffffff'},
        };
        return {entry:["bar",id],extra:[[ [layer,"bars",id], layers[layer].bars[id] ]]};
    }
    if(type==="infobox"){
        let n=11;
        if(layers[layer].infoboxes===undefined)layers[layer].infoboxes={};
        while(layers[layer].infoboxes[String(n)]!==undefined)n++;
        const id=String(n);
        
        
        if(typeof player!=="undefined"&&player){
            if(player.infoboxes===undefined)player.infoboxes={};
            if(player.infoboxes[layer]===undefined)player.infoboxes[layer]={};
            player.infoboxes[layer][id]=false;
            if(player[layer]&&typeof player[layer]==="object"){
                if(player[layer].infoboxesOpen===undefined)tmtSet(player[layer],"infoboxesOpen",{});
                if(player[layer].infoboxesOpen[id]===undefined)tmtSet(player[layer].infoboxesOpen,id,false);
            }
        }
        layers[layer].infoboxes[id]={
            title:(content!==undefined&&content!==null&&content!=="")?content:tmtT("tpl_newInfobox"),
            body:tmtT("infoboxBodyHint"),
            unlocked:true,
        };
        return {entry:["infobox",id],extra:[[ [layer,"infoboxes",id], layers[layer].infoboxes[id] ]]};
    }
    const simple={
        "upgrades":["upgrades"],"milestones":["milestones"],"challenges":["challenges"],
        "clickables":["clickables"],"buyables":["buyables"],"achievements":["achievements"],
        "grid":["grid"],"main-display":["main-display"],"prestige-button":["prestige-button"],
        "resource-display":["resource-display"],"blank":["blank"],"h-line":["h-line"],"v-line":["v-line"],
    };
    if(simple[type]===undefined)return {error:tmtT("m_unknownType")+type};
    return {entry:simple[type].slice()};
}



function tmtInsertComponent(layer,type,content,atStart){
    const ld=layers[layer];
    if(!ld)return alert(tmtT("m_noLayer")+layer),false;
    const built=tmtBuildEntry(layer,type,content);
    if(built.error)return alert(built.error),false;
    const at=(typeof tmtInsertIndex==="number")?tmtInsertIndex:-1;
    
    if(ld.tabFormat===undefined){
        
        const defaults=["main-display","prestige-button","resource-display","milestones","clickables","buyables","upgrades","challenges","achievements"];
        ld.tabFormat=atStart||at===0?[built.entry].concat(defaults):defaults.concat([built.entry]);
    }
    else if(Array.isArray(ld.tabFormat)){
        if(at>=0)ld.tabFormat.splice(at,0,built.entry);
        else if(atStart)ld.tabFormat.unshift(built.entry);
        else ld.tabFormat.push(built.entry);
    }
    else{
        const cur=player.subtabs[layer]&&player.subtabs[layer].mainTabs;
        const sub=cur&&ld.tabFormat[cur];
        if(!sub)return alert(tmtT("m_noLayer")+cur),false;
        if(sub.embedLayer)return false;
        if(at>=0)sub.content.splice(at,0,built.entry);
        else if(atStart)sub.content.unshift(built.entry);
        else sub.content.push(built.entry);
    }
    
    if(built.extra){for(const [p,v] of built.extra)setModPath(p,v);}
    setModPath([layer,"tabFormat"],ld.tabFormat);
    try{
        tmtSyncTabFormat(layer);
        if(typeof updateTemp==="function")updateTemp();
        if(typeof updateTabFormats==="function")updateTabFormats();
        if(typeof save==="function")save();
    }catch(e){
        
        alert(tmtT("m_writeFail")+(e&&e.message?e.message:e));
        return false;
    }
    return true;
}


function addComponent(layer){
    const ld=layers[layer];
    if(!ld)return alert(tmtT("m_noLayer")+layer);
    const lines=tmtComponentTypes().map(t=>t[1]+"（"+t[0]+"）").join("\n");
    let type=prompt(lines,"display-text");
    if(type===null)return;
    type=type.trim();
    const meta=tmtComponentTypes().filter(t=>t[0]===type)[0];
    if(meta===undefined)return alert(tmtT("m_unknownType")+type);
    let content="";
    if(meta[2]){
        content=prompt(meta[3]+"（"+type+"）","");
        if(content===null)return;
    }
    return tmtInsertComponent(layer,type,content,false);
}


function addComponentDialog(layer){
    const ld=layers[layer];
    if(!ld)return alert(tmtT("m_noLayer")+layer);
    if(document.getElementById("tmtAddDlg"))return;
    const overlay=document.createElement("div");
    overlay.id="tmtAddDlg";
    overlay.style.cssText="position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.55);z-index:1000000;display:flex;align-items:center;justify-content:center;font:13px/1.7 monospace";
    const panel=document.createElement("div");
    panel.style.cssText="background:#111;color:#ddd;border:1px solid #0f0;border-radius:8px;padding:14px 16px;width:360px;max-width:92vw;box-shadow:0 4px 24px rgba(0,0,0,.6)";
    const title=document.createElement("div");
    title.style.cssText="color:#0f0;margin-bottom:8px";
    title.textContent=tmtT("addToLayer",{L:layer})+(typeof tmtInsertIndex==="number"&&tmtInsertIndex>=0?tmtT("insertBefore",{N:tmtInsertIndex+1}):"");
    const typeSel=document.createElement("select");
    typeSel.style.cssText="width:100%;background:#000;color:#ddd;border:1px solid #555;padding:3px;margin-bottom:8px";
    for(const [type,label] of tmtComponentTypes().map(t=>[t[0],t[1]])){
        const opt=document.createElement("option");
        opt.value=type;opt.textContent=label;
        typeSel.appendChild(opt);
    }
    const contentLabel=document.createElement("div");
    contentLabel.style.cssText="margin-bottom:3px;color:#999";
    const contentInput=document.createElement("input");
    contentInput.style.cssText="width:100%;box-sizing:border-box;background:#000;color:#0f0;border:1px solid #555;padding:4px;margin-bottom:8px";
    const posWrap=document.createElement("div");
    posWrap.style.cssText="margin-bottom:10px;color:#999";
    posWrap.innerHTML='<label style="margin-right:14px"><input type="radio" name="tmtpos" value="end" checked> '+tmtT("addToEnd")+'</label><label><input type="radio" name="tmtpos" value="start"> '+tmtT("addToFront")+'</label>';
    const btnRow=document.createElement("div");
    btnRow.style.cssText="text-align:right";
    const cancelBtn=document.createElement("button");
    cancelBtn.textContent=tmtT("cancel");
    cancelBtn.style.cssText="background:#000;color:#999;border:1px solid #555;border-radius:4px;padding:3px 12px;margin-right:8px;cursor:pointer";
    const okBtn=document.createElement("button");
    okBtn.textContent=tmtT("add");
    okBtn.style.cssText="background:#000;color:#0f0;border:1px solid #0f0;border-radius:4px;padding:3px 16px;cursor:pointer";
    const refresh=()=>{
        const meta=tmtComponentTypes().filter(t=>t[0]===typeSel.value)[0];
        const need=meta&&meta[2];
        contentLabel.style.display=need?"block":"none";
        contentInput.style.display=need?"block":"none";
        if(need)contentLabel.textContent=meta[3]+"：";
    };
    typeSel.addEventListener("change",refresh);
    refresh();
    const close=()=>{overlay.remove();};
    cancelBtn.addEventListener("click",close);
    overlay.addEventListener("click",(e)=>{if(e.target===overlay)close();});
    okBtn.addEventListener("click",()=>{
        const atStart=(posWrap.querySelector("input[name=tmtpos]:checked")||{}).value==="start";
        const ok=tmtInsertComponent(layer,typeSel.value,contentInput.value,atStart);
        tmtInsertIndex=-1;
        if(ok)close();
    });
    overlay.addEventListener("click",(e)=>{
        if(e.target===overlay){tmtInsertIndex=-1;close();}
    });
    cancelBtn.addEventListener("click",()=>{tmtInsertIndex=-1;close();});
    panel.appendChild(title);
    panel.appendChild(typeSel);
    panel.appendChild(contentLabel);
    panel.appendChild(contentInput);
    panel.appendChild(posWrap);
    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(okBtn);
    panel.appendChild(btnRow);
    overlay.appendChild(panel);
    (document.body||document.documentElement).appendChild(overlay);
    typeSel.focus();
}




function tmtSet(obj,key,value){
    if(typeof Vue!=="undefined"&&Vue.set){try{Vue.set(obj,key,value);return;}catch(e){}}
    obj[key]=value;
}
function tmtSyncTabFormat(layer){
    if(typeof tmp==="undefined"||!tmp||!tmp[layer])return;
    const ld=layers[layer];
    if(!ld)return;
    
    
    const prune=(arr)=>{if(!Array.isArray(arr))return;for(let i=arr.length-1;i>=0;i--){if(Array.isArray(arr[i])&&arr[i].length===0)arr.splice(i,1);}};
    if(Array.isArray(ld.tabFormat)){
        prune(ld.tabFormat);
        if(typeof mod!=="undefined"&&mod&&Array.isArray(mod[layer]&&mod[layer].tabFormat))prune(mod[layer].tabFormat);
    }
    const tf=ld.tabFormat;
    if(tf===undefined)return;
    const hasFuncs=typeof funcs!=="undefined"&&funcs&&funcs[layer]!==undefined;
    if(Array.isArray(tf)){
        if(!Array.isArray(tmp[layer].tabFormat))tmtSet(tmp[layer],"tabFormat",[]);
        
        
        if(hasFuncs&&(!Array.isArray(funcs[layer].tabFormat)||funcs[layer].tabFormat===tf))funcs[layer].tabFormat=[];
        tf.forEach((e,i)=>tmtSyncEntry(e,tmp[layer].tabFormat,hasFuncs?funcs[layer].tabFormat:null,i));
        if(tmp[layer].tabFormat.length>tf.length)tmp[layer].tabFormat.splice(tf.length);
        if(hasFuncs&&funcs[layer].tabFormat.length>tf.length)funcs[layer].tabFormat.splice(tf.length);
    }
	else if(tf&&typeof tf==="object"){
		const cur=player.subtabs[layer]&&player.subtabs[layer].mainTabs;
		const src=tf[cur]&&tf[cur].content;
		if(!src)return;
		prune(src);
		
		
		
		if(hasFuncs&&funcs[layer].tabFormat===tf){
			const own={};
			for(const k in tf){
				const v=tf[k];
				own[k]=(v!==null&&typeof v==="object"&&!Array.isArray(v))?Object.assign({},v):v;
			}
			funcs[layer].tabFormat=own;
		}
		if(hasFuncs&&funcs[layer].tabFormat[cur]===tf[cur])funcs[layer].tabFormat[cur]=Object.assign({},tf[cur]);
		if(tmp[layer].tabFormat[cur]===undefined)tmtSet(tmp[layer].tabFormat,cur,{content:[]});
		if(!Array.isArray(tmp[layer].tabFormat[cur].content))tmtSet(tmp[layer].tabFormat[cur],"content",[]);
		let ff=null;
		if(hasFuncs){
			if(funcs[layer].tabFormat[cur]===undefined)funcs[layer].tabFormat[cur]={content:[]};
			if(funcs[layer].tabFormat[cur].content===src)funcs[layer].tabFormat[cur].content=[];
			if(!Array.isArray(funcs[layer].tabFormat[cur].content))funcs[layer].tabFormat[cur].content=[];
			ff=funcs[layer].tabFormat[cur].content;
		}
		const tt=tmp[layer].tabFormat[cur];
		src.forEach((e,i)=>tmtSyncEntry(e,tt.content,ff,i));
		if(tt.content.length>src.length)tt.content.splice(src.length);
		if(ff&&ff.length>src.length)ff.splice(src.length);
	}
}






function tmtSyncEntry(entry,tmpArr,funcArr,idx){
	const placeholder=typeof decimalOne!=="undefined"?decimalOne:1;
	if(entry!==null&&typeof entry==="object"&&Array.isArray(entry)){
		if(funcArr)tmtSet(funcArr,idx,[]);
		tmtSet(tmpArr,idx,[]);
		const fSlot=funcArr?funcArr[idx]:null;
		for(let i=0;i<entry.length;i++){
			const v=entry[i];
			if(typeof v==="function"){if(fSlot)tmtSet(fSlot,i,v);tmtSet(tmpArr[idx],i,placeholder);}
			else if(v!==null&&typeof v==="object"&&Array.isArray(v)){
				if(fSlot)tmtSet(fSlot,i,[]);
				tmtSet(tmpArr[idx],i,[]);
				v.forEach((x,j)=>tmtSyncEntry(x,tmpArr[idx][i],fSlot?fSlot[i]:null,j));
			}
			else tmtSet(tmpArr[idx],i,v);
		}
	}
	else if(typeof entry==="function"){
		if(funcArr)tmtSet(funcArr,idx,entry);
		tmtSet(tmpArr,idx,placeholder);
	}
	else tmtSet(tmpArr,idx,entry);
}



function tmtCloneForTmp(value){
    if(value===null||value===undefined)return value;
    if(typeof value!=="object")return value;
    if(value instanceof Decimal)return value;
    if(Array.isArray(value))return value.map(tmtCloneForTmp);
    const o={};
    for(const k in value)o[k]=tmtCloneForTmp(value[k]);
    return o;
}



function setModPath(path,value){
    let p=mod,m=(typeof tmp!=="undefined"&&tmp)?tmp:null,f=(typeof funcs!=="undefined"&&funcs)?funcs:null,l=(typeof layers!=="undefined"&&layers)?layers:null;
    const t=path[path.length-1];
    for(const k of path.slice(0,-1)){
        if(p[k]==null)tmtSet(p,k,{});
        p=p[k];
        if(m){if(m[k]==null)tmtSet(m,k,{});m=m[k];}
        if(f){if(f[k]==null)f[k]={};f=f[k];}
        if(l){if(l[k]==null)l[k]={};l=l[k];}
    }
    const isContainer=value!==null&&typeof value==="object"&&!(value instanceof Decimal);
    tmtSet(p,t,value);
    if(m)tmtSet(m,t,isContainer?tmtCloneForTmp(value):value);
    if(f)f[t]=value;
    if(l)l[t]=value;
}


function tmtCopyText(text){
    if(navigator.clipboard&&window.isSecureContext){
        navigator.clipboard.writeText(text);
        return;
    }
    const el=document.createElement("textarea");
    el.value=text;
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0,99999);
    document.execCommand("copy");
    document.body.removeChild(el);
}







function tmtCurrentLayerId(){
    try{
        if(typeof player!=="undefined"&&player){
            if(player.tab&&player.tab!=="none"&&player.tab!=="none-tab")return player.tab;
            if(player.navTab&&player.navTab!=="none")return player.navTab;
        }
    }catch(e){}
    return Object.keys(layers)[0];
}


function tmtEditField(layer,path,raw,kind){
    const ld=layers[layer];
    if(!ld)return false;
    let node=ld;
    for(let i=0;i<path.length-1;i++){
        if(node==null)return false;
        node=node[String(path[i])];
    }
    if(node==null)return false;
    const key=String(path[path.length-1]);
    let value=raw;
    try{
        if(kind==="fn"){
            const parsed=tmtParseFn(String(raw).trim());
            if(!parsed){alert(tmtT("m_fnParseFail"));return false;}
            value=tmtBuildFn(parsed);
        }
        else if(kind==="dec"){
            if(String(raw).trim()==="")return false;
            value=new Decimal(raw);
            if(value.mag!==value.mag)return false;
        }
        else if(kind==="num"){
            if(String(raw).trim()==="")return false;
            value=Number(raw);
            if(isNaN(value)){alert(tmtT("m_badNumber"));return false;}
        }
        else if(kind==="bool"){
            value=(raw===true||raw==="true"||raw===1);
        }
        else value=String(raw);
    }catch(e){
        alert(tmtT("m_writeFail")+(e&&e.message?e.message:e));
        return false;
    }
    node[key]=value;
    setModPath([layer].concat(path),value);
    tmtAfterEdit(layer);
    return true;
}


function tmtDeleteField(layer,path){
    const ld=layers[layer];
    if(!ld)return false;
    let parent=ld,ok=true;
    for(let i=0;i<path.length-1;i++){
        if(parent==null){ok=false;break;}
        parent=parent[String(path[i])];
    }
    if(!ok||parent==null)return false;
    tmtRawDelete(ld,path);
    if(typeof mod!=="undefined"){
        if(!Array.isArray(mod.__del))mod.__del=[];
        mod.__del.push([layer].concat(path).map(String));
    }
    tmtAfterEdit(layer);
    return true;
}


function tmtMoveField(layer,path,delta){
    const ld=layers[layer];
    if(!ld)return false;
    let parent=ld;
    for(let i=0;i<path.length-1;i++){
        if(parent==null)return false;
        parent=parent[String(path[i])];
    }
    if(!Array.isArray(parent))return false;
    const i=Number(path[path.length-1]),j=i+delta;
    if(i<0||i>=parent.length||j<0||j>=parent.length)return false;
    const v=parent.splice(i,1)[0];
    parent.splice(j,0,v);
    
    const containerPath=[layer].concat(path.slice(0,-1).map(String));
    setModPath(containerPath,parent);
    tmtAfterEdit(layer);
    return true;
}


function tmtNewItem(layer,container){
    const ld=layers[layer];
    if(!ld)return null;
    const templates={
        upgrades:{title:tmtT("tpl_newUpgrade"),description:tmtT("tpl_upgradeDesc"),cost:new Decimal(1)},
        milestones:{requirementDescription:tmtT("tpl_newMilestone"),effectDescription:function(){return tmtT("tpl_milestoneEffect");}},
        challenges:{name:tmtT("tpl_newChallenge"),challengeDescription:tmtT("tpl_challengeDesc"),goal:new Decimal("1e6"),rewardDescription:tmtT("tpl_rewardDesc")},
        clickables:{title:tmtT("tpl_newClickable"),display:function(){return tmtT("tpl_clickMe");}},
        buyables:{title:tmtT("tpl_newBuyable"),description:tmtT("tpl_buyableDesc"),cost:new Decimal(1)},
        achievements:{name:tmtT("tpl_newAchievement")},
        bars:{text:"0%",display:function(){return "0%";}},
        infoboxes:{title:tmtT("tpl_newInfobox"),body:tmtT("infoboxBodyHint")},
    };
    const tpl=templates[container]||{title:tmtT("tpl_newItem")};
    if(ld[container]===undefined)ld[container]={};
    const obj=ld[container];
    let id="11",n=11;
    while(obj[String(n)]!==undefined)n++;
    id=String(n);
    obj[id]=tpl;
    
    if(["upgrades","milestones","challenges","clickables","buyables","achievements"].includes(container)){
        if(obj.rows===undefined||obj.cols===undefined){
            obj.rows=Math.floor(Number(id)/10)+1;
            obj.cols=Number(id)%10+1;
        }
    }
    
    if(container==="infoboxes"&&typeof player!=="undefined"&&player){
        if(player.infoboxes===undefined)player.infoboxes={};
        if(player.infoboxes[layer]===undefined)player.infoboxes[layer]={};
    }
    setModPath([layer,container],obj);
    tmtAfterEdit(layer);
    return id;
}


function tmtAddField(layer,path,name,kind){
    const ld=layers[layer];
    if(!ld)return false;
    let node=ld;
    for(let i=0;i<path.length;i++){
        if(node==null)return false;
        node=node[String(path[i])];
    }
    if(node==null||typeof node!=="object")return false;
    if(name in node&&!confirm(tmtT("e_overwrite",{K:name})))return false;
    const init={text:tmtT("tpl_newContent"),num:0,bool:false,dec:new Decimal(1),fn:function(){return tmtT("tpl_newContent");},obj:{},arr:[]};
    node[name]=init[kind]!==undefined?init[kind]:tmtT("tpl_newContent");
    setModPath([layer].concat(path).concat([name]),node[name]);
    tmtAfterEdit(layer);
    return true;
}


function tmtAfterEdit(layer){
    try{
        if(layers[layer]&&layers[layer].tabFormat!==undefined)tmtSyncTabFormat(layer);
        if(typeof updateTemp==="function")updateTemp();
        if(typeof updateTabFormats==="function")updateTabFormats();
    }catch(e){}
    try{if(typeof save==="function")save();}catch(e){}
}



function tmtEditorStyle(){
    if(document.getElementById("tmtEditorStyle"))return;
    const st=document.createElement("style");
    st.id="tmtEditorStyle";
    st.textContent=
        "#tmtEditor{position:fixed;right:0;top:0;bottom:0;width:440px;max-width:94vw;z-index:9999999;"+
        "background:#0b0b0b;color:#ddd;font:12px/1.6 monospace;display:flex;flex-direction:column;"+
        "border-left:1px solid #0f0;box-shadow:-4px 0 24px rgba(0,0,0,.6)}"+
        "#tmtEditor .teHead{padding:8px;border-bottom:1px solid #234;display:flex;gap:6px;align-items:center;flex-wrap:wrap}"+
        "#tmtEditor .teBody{flex:1;overflow:auto;padding:6px 8px 20px}"+
        "#tmtEditor .teFoot{padding:8px;border-top:1px solid #234;display:flex;gap:6px}"+
        "#tmtEditor .teRow{display:flex;gap:4px;align-items:flex-start;padding:1px 0}"+
        "#tmtEditor .teKey{color:#8fd;min-width:96px;flex-shrink:0;word-break:break-all}"+
        "#tmtEditor .teKeyBtn{background:none;border:none;color:#8fd;cursor:pointer;font:inherit;padding:0;text-align:left}"+
        "#tmtEditor input[type=text],#tmtEditor input[type=number],#tmtEditor textarea,"+
        "#tmtEditor select{background:#000;color:#dfd;border:1px solid #345;border-radius:3px;font:12px monospace;padding:1px 3px;box-sizing:border-box}"+
        "#tmtEditor textarea{width:100%;min-height:52px}"+
        "#tmtEditor button.teBtn{background:#000;color:#0f0;border:1px solid #0f0;border-radius:3px;cursor:pointer;font:11px monospace;padding:0 5px}"+
        "#tmtEditor button.teBtn:hover{background:#0f0;color:#000}"+
        "#tmtEditor .teType{color:#a86;opacity:.8;flex-shrink:0}"+
        "#tmtEditor .teKids{margin-left:14px;border-left:1px dotted #234;padding-left:6px}"+
        "#tmtEditor .teFlash{color:#0f0}";
    document.head.appendChild(st);
}


function tmtOpenEditor(layerId){
    const old=document.getElementById("tmtEditor");
    if(old){old.remove();return;}
    if(typeof layers==="undefined")return;
    tmtEditorStyle();
    const panel=document.createElement("div");
    panel.id="tmtEditor";
    document.body.appendChild(panel);
    const state={layer:layerId||tmtCurrentLayerId(),openAll:false,open:{}};
    const head=document.createElement("div");
    head.className="teHead";
    const body=document.createElement("div");
    body.className="teBody";
    const foot=document.createElement("div");
    foot.className="teFoot";
    panel.appendChild(head);panel.appendChild(body);panel.appendChild(foot);

    const flash=(msg,color)=>{
        const el=document.createElement("span");
        el.className="teFlash";el.style.color=color||"#0f0";
        el.textContent=msg;
        head.appendChild(el);
        setTimeout(()=>el.remove(),1500);
    };
    const refresh=()=>render();

    
    function node(key,value,path,depth,parentIsArray,index){
        const row=document.createElement("div");
        row.className="teRow";
        const kind=tmtValueKind(value);
        const idKey=path.join(".");
        const openable=(kind==="obj"||kind==="arr"||kind==="fn");
        const isOpen=state.openAll||state.open[idKey];

        
        const keyWrap=document.createElement("div");
        keyWrap.className="teKey";
        if(openable){
            const b=document.createElement("button");
            b.className="teKeyBtn";
            b.textContent=(isOpen?"▾ ":"▸ ")+(key===null?"":key);
            b.onclick=()=>{state.open[idKey]=!isOpen;refresh();};
            keyWrap.appendChild(b);
            if(key!==null&&kind==="obj"){
                const add=document.createElement("button");
                add.className="teBtn";add.textContent=tmtT("e_addField");add.style.marginLeft="4px";
                add.onclick=()=>{
                    const name=prompt(tmtT("e_newFieldName"));
                    if(!name)return;
                    const k=prompt(tmtT("e_newFieldType"),"text");
                    tmtAddField(state.layer,path,name.trim(),(k||"text").trim());
                    refresh();
                };
                keyWrap.appendChild(add);
            }
            if(key!==null&&isContainerKey(path,parentIsArray)){
                const nb=document.createElement("button");
                nb.className="teBtn";nb.textContent=tmtT("e_addItem");nb.style.marginLeft="4px";
                nb.onclick=()=>{tmtNewItem(state.layer,key);flash(tmtT("e_itemCreated"));refresh();};
                keyWrap.appendChild(nb);
            }
        }else{
            keyWrap.textContent=key===null?"":key;
        }
        row.appendChild(keyWrap);

        
        const valWrap=document.createElement("div");
        valWrap.style.flex="1";valWrap.style.minWidth="0";
        row.appendChild(valWrap);

        if(kind==="fn"){
            if(isOpen){
                const ta=document.createElement("textarea");
                ta.value=Function.prototype.toString.call(value);
                valWrap.appendChild(ta);
                const bar=document.createElement("div");
                bar.style.marginTop="3px";
                const ok=document.createElement("button");
                ok.className="teBtn";ok.textContent=tmtT("e_saveFn");
                ok.onclick=()=>{
                    if(tmtEditField(state.layer,path,ta.value,"fn")){flash(tmtT("e_fnSaved"));refresh();}
                    else flash(tmtT("e_fnNotSaved"),"#f66");
                };
                const cancel=document.createElement("button");
                cancel.className="teBtn";cancel.textContent=tmtT("cancel");cancel.style.marginLeft="4px";
                cancel.onclick=refresh;
                bar.appendChild(ok);bar.appendChild(cancel);
                valWrap.appendChild(bar);
            }else{
                const s=document.createElement("span");
                s.className="teType";
                s.textContent=tmtT("e_fnHint");
                valWrap.appendChild(s);
            }
        }
        else if(kind==="obj"||kind==="arr"){
            const meta=document.createElement("span");
            meta.className="teType";
            meta.textContent=kind==="arr"?tmtT("e_arrItems",{N:value.length}):tmtT("e_objFields",{N:Object.keys(value).length});
            valWrap.appendChild(meta);
        }
        else{
            
            if(kind==="bool"){
                const cb=document.createElement("input");
                cb.type="checkbox";cb.checked=!!value;
                cb.onchange=()=>tmtEditField(state.layer,path,cb.checked?"true":"false","bool");
                valWrap.appendChild(cb);
            }
            else{
                const isLong=typeof value==="string"&&value.length>=50;
                const inp=document.createElement(isLong?"textarea":"input");
                if(!isLong){
                    inp.type=(kind==="num")?"number":"text";
                    if(kind==="dec")inp.type="text";
                }
                inp.value=value===null?"":(typeof value==="string"?value:String(value));
                const commit=()=>{
                    const k=kind==="num"?"num":(kind==="dec"?"dec":"text");
                    if(tmtEditField(state.layer,path,inp.value,k))flash(tmtT("e_saved"));
                    else {flash(tmtT("m_writeFail"),"#f66");render();}
                };
                inp.onchange=commit;
                if(isLong){inp.onblur=commit;}
                valWrap.appendChild(inp);
            }
        }

        
        const ops=document.createElement("div");
        ops.style.flexShrink="0";
        if(parentIsArray&&index!=null){
            const up=document.createElement("button");
            up.className="teBtn";up.textContent="⬆";
            up.onclick=()=>{tmtMoveField(state.layer,path,-1);refresh();};
            const down=document.createElement("button");
            down.className="teBtn";down.textContent="⬇";
            down.onclick=()=>{tmtMoveField(state.layer,path,1);refresh();};
            const ins=document.createElement("button");
            ins.className="teBtn";ins.textContent="＋";ins.title=tmtT("e_insertAfter");
            ins.onclick=()=>{
                tmtInsertIndex=index+1;
                addComponentDialog(state.layer);
            };
            ops.appendChild(up);ops.appendChild(down);ops.appendChild(ins);
        }
        if(key!==null){
            const del=document.createElement("button");
            del.className="teBtn";del.textContent="✕";del.title=tmtT("e_deleteTip");
            del.onclick=()=>{
                if(confirm(tmtT("e_confirmDelete",{K:key}))){tmtDeleteField(state.layer,path);flash(tmtT("e_deleted"));refresh();}
            };
            ops.appendChild(del);
        }
        row.appendChild(ops);

        
        const wrap=document.createElement("div");
        if(openable){
            if(isOpen){
                const kids=document.createElement("div");
                kids.className="teKids";
                const entries=kind==="arr"?value.map((v,i)=>[String(i),v]):Object.keys(value).map(k=>[k,value[k]]);
                if(entries.length===0){
                    const empty=document.createElement("div");
                    empty.className="teType";empty.textContent=tmtT("e_empty");
                    kids.appendChild(empty);
                }
                for(const [k,v] of entries){
                    kids.appendChild(node(k,v,path.concat([k]),depth+1,kind==="arr",kind==="arr"?Number(k):null));
                }
                wrap.appendChild(kids);
            }
        }
        const box=document.createElement("div");
        box.appendChild(row);
        box.appendChild(wrap);
        return box;
    }

    function isContainerKey(path,parentIsArray){
        if(parentIsArray)return false;
        const last=path[path.length-1];
        return ["upgrades","milestones","challenges","clickables","buyables","achievements","bars","infoboxes"].includes(last);
    }

    function tmtValueKind(v){
        if(typeof v==="function")return "fn";
        if(v===null)return "null";
        if(v===undefined)return "null";
        if(Array.isArray(v))return "arr";
        if(v instanceof Decimal)return "dec";
        if(typeof v==="object")return "obj";
        if(typeof v==="number")return "num";
        if(typeof v==="boolean")return "bool";
        return "text";
    }

    function render(){
        
        head.innerHTML="";
        const lab=document.createElement("span");
        lab.textContent=tmtT("e_layer");lab.style.color="#8fd";
        head.appendChild(lab);
        const sel=document.createElement("select");
        for(const name of Object.keys(layers)){
            const o=document.createElement("option");
            o.value=name;o.textContent=name;
            if(name===state.layer)o.selected=true;
            sel.appendChild(o);
        }
        sel.onchange=()=>{state.layer=sel.value;state.open={};render();};
        head.appendChild(sel);
        const all=document.createElement("button");
        all.className="teBtn";all.textContent=state.openAll?tmtT("e_collapseAll"):tmtT("e_expandAll");
        all.onclick=()=>{state.openAll=!state.openAll;render();};
        head.appendChild(all);
        const close=document.createElement("button");
        close.className="teBtn";close.textContent=tmtT("e_close");
        close.onclick=()=>panel.remove();
        head.appendChild(close);

        
        body.innerHTML="";
        const ld=layers[state.layer];
        if(!ld){
            body.textContent=tmtT("e_layerMissing");
            return;
        }
        if(!state.openAll&&Object.keys(state.open).length===0){
            state.open["root"]=true;
        }
        const keys=Object.keys(ld);
        for(const k of keys){
            body.appendChild(node(k,ld[k],[k],0,false,null));
        }

        
        foot.innerHTML="";
        const mk=(text,fn)=>{
            const b=document.createElement("button");
            b.className="teBtn";b.textContent=text;
            b.onclick=fn;
            foot.appendChild(b);
            return b;
        };
        mk(tmtT("b_export"),()=>{
            tmtCopyText(modToJSON(mod||{}));
            flash(tmtT("m_copied"));
        });
        mk(tmtT("b_import"),()=>{
            const s=prompt(tmtT("m_pasteJson"));
            if(s&&importModString(s)){try{save();}catch(e){}refresh();flash(tmtT("m_imported"));}
        });
        mk(tmtT("b_clear"),()=>{
            if(!confirm(tmtT("m_confirmClear")))return;
            mod={};
            try{const k=(typeof getModID==="function")?getModID()+"_mod":"modbase_mod";localStorage.removeItem(k);}catch(e){}
            try{save();}catch(e){}
            try{const k=(typeof getModID==="function")?getModID()+"_mod":"modbase_mod";localStorage.removeItem(k);}catch(e){}
            window.location.reload();
        });
    }
    render();
}














const TMT_LAYOUT_KEY="__layout";
const TMT_LAYOUT_SNAP=8;
const TMT_LAYOUT_OWN="#tmtLiveBar,#tmtEditor,#tmtAddDlg,#tmtLayoutBox,#tmtLayoutTag,#tmtLayoutHud,#tmtLayoutPanel";

let tmtLayoutOn=false;      
let tmtLayoutBooted=false;
let tmtLayoutGrab=0;       
let tmtLayoutHover=null;   
let tmtLayoutDrag=null;    
let tmtLayoutLift=null;    
let tmtLayoutPtr={x:0,y:0,dirty:false};
let tmtLayoutStoreRef=null;
let tmtLayoutRecs=null;    
let tmtLayoutBound=null;   
let tmtLayoutLost=null;    
let tmtLayoutVueIndex=null;
let tmtLayoutIndexAt=0;   
let tmtLayoutLoop=null;    
let tmtLayoutClicks=0;     
let tmtLayoutClickTimer=null;
let tmtLayoutFlashTimer=null;
let tmtLayoutLocateEl=null;
let tmtLayoutLocateUntil=0;




function tmtLayoutStore(create){
    if(typeof mod==="undefined"||!mod)return null;
    let st=mod[TMT_LAYOUT_KEY];
    if(typeof st!=="object"||st===null){
        if(!create)return null;
        st=mod[TMT_LAYOUT_KEY]={};
    }
    return st;
}


function tmtLayoutRecsMap(){
    const st=tmtLayoutStore(false);
    if(!st){
        tmtLayoutStoreRef=null;tmtLayoutRecs=new Map();tmtLayoutBound=new Map();tmtLayoutLost=new Set();
        return tmtLayoutRecs;
    }
    if(st!==tmtLayoutStoreRef){
        tmtLayoutStoreRef=st;
        tmtLayoutRecs=new Map();
        tmtLayoutBound=new Map();
        tmtLayoutLost=new Set();
        tmtLayoutVueIndex=null;
        for(const k in st)tmtLayoutRecs.set(k,st[k]);
        return tmtLayoutRecs;
    }
    if(!tmtLayoutRecs)tmtLayoutRecs=new Map();
    for(const k in st)if(!tmtLayoutRecs.has(k))tmtLayoutRecs.set(k,st[k]);
    for(const k of Array.from(tmtLayoutRecs.keys())){
        if(!(k in st)){
            tmtLayoutRecs.delete(k);
            tmtLayoutBound&&tmtLayoutBound.delete(k);
            tmtLayoutLost&&tmtLayoutLost.delete(k);
        }
    }
    return tmtLayoutRecs;
}


function tmtLayoutInvalidate(){
    tmtLayoutStoreRef=null;
    tmtLayoutRecs=null;tmtLayoutBound=null;tmtLayoutLost=null;tmtLayoutVueIndex=null;
    tmtLayoutKick();
}

function tmtLayoutRoot(){
    return document.getElementById("app")||document.body||document.documentElement;
}


function tmtLayoutSig(el){
    let s=el.tagName.toLowerCase();
    if(el.id)s+="#"+el.id;
    const cls=(el.getAttribute("class")||"").trim().split(/\s+/)
        .filter(c=>c&&c!=="instant"&&c!=="can"&&c!=="locked"&&c!=="bought"&&c!=="tooltipBox").slice(0,3).join(".");
    if(cls)s+="."+cls;
    const t=(el.textContent||"").replace(/\s+/g," ").trim().slice(0,24);
    if(t)s+=" “"+t+"”";
    return s;
}


function tmtLayoutClearStyle(el){
    el.style.position="";el.style.left="";el.style.top="";el.style.transform="";
    el.style.width="";el.style.height="";el.style.zIndex="";
    delete el.__tmtLay;
}









function tmtLayoutRelPath(a,b){
    const p=[];
    let n=b;
    while(n&&n!==a){
        const pa=n.parentElement;
        if(!pa)return null;
        p.unshift(Array.prototype.indexOf.call(pa.children,n));
        n=pa;
    }
    return n===a?p.join("."):null;
}

function tmtLayoutAnchor(el){
    if(!el||el.nodeType!==1||!el.tagName)return null;
    const root=tmtLayoutRoot();
    if(el===root||el===document.body||el===document.documentElement)return null;
    
    
    if(el.id&&document.getElementById(el.id)===el)return "i:"+el.id;
    const tag=el.tagName;
    let node=el;
    while(node&&node!==root&&node.parentElement){
        const vn=node.__vue__&&node.__vue__.$vnode;
        if(vn&&vn.key!==undefined&&vn.key!==null){
            const rel=tmtLayoutRelPath(node,el);
            if(rel===null)break;
            
            return "v:"+(typeof vn.key==="number"?"n":"s")+":"+encodeURIComponent(String(vn.key))+":"+tag+":"+rel;
        }
        node=node.parentElement;
    }
    const abs=tmtLayoutRelPath(root,el);
    return abs===null?null:"p:"+tag+":"+abs;
}

function tmtLayoutWalk(root,path){
    if(!root)return null;
    if(path==="")return root;
    let el=root;
    for(const i of path.split(".")){
        if(!el)return null;
        el=el.children[Number(i)];
    }
    return el||null;
}


function tmtLayoutAtDepth(root,depth,tag){
    if(!root)return null;
    let level=[root],found=null;
    for(let d=0;d<depth&&level.length;d++){
        const next=[];
        for(const n of level)for(let i=0;i<n.children.length;i++)next.push(n.children[i]);
        level=next;
    }
    for(const n of level)if(n.tagName===tag){if(found)return null;found=n;}
    return found;
}

function tmtLayoutBuildVueIndex(){
    const m=new Map();
    const root=tmtLayoutRoot();
    tmtLayoutIndexAt=Date.now();
    if(!root)return m;
    const vn0=root.__vue__&&root.__vue__.$vnode;
    if(vn0&&vn0.key!==undefined&&vn0.key!==null)m.set((typeof vn0.key==="number"?"n":"s")+String(vn0.key),root);
    const all=root.querySelectorAll("*");
    for(let i=0;i<all.length;i++){
        const el=all[i];
        const vn=el.__vue__&&el.__vue__.$vnode;
        if(!vn||vn.key===undefined||vn.key===null)continue;
        const k=(typeof vn.key==="number"?"n":"s")+String(vn.key);
        if(!m.has(k))m.set(k,el);
    }
    return m;
}


function tmtLayoutResolve(key,useIndex){
    const root=tmtLayoutRoot();
    if(!root||!key)return null;
    const p=key.split(":");
    if(p[0]==="i"){
        const el=document.getElementById(p.slice(1).join(":"));
        return el&&root.contains(el)?el:null;
    }
    if(p[0]==="v"){
        const tag=p[3],rel=p[4];
        if(!useIndex)return null;
        if(!tmtLayoutVueIndex)tmtLayoutVueIndex=tmtLayoutBuildVueIndex();
        const host=tmtLayoutVueIndex.get(p[1]+p[2]);
        if(!host||!host.isConnected)return null;
        if(rel==="")return host.tagName===tag?host:null;
        const el=tmtLayoutWalk(host,rel);
        if(el&&el.tagName===tag)return el;
        return tmtLayoutAtDepth(host,rel.split(".").length,tag);
    }
    if(p[0]==="p"){
        const tag=p[1],abs=p[2];
        const el=tmtLayoutWalk(root,abs);
        if(el&&el.tagName===tag)return el;
        return tmtLayoutAtDepth(root,abs.split(".").length,tag);
    }
    return null;
}




function tmtLayoutApply(el,rec){
    const x=Math.round(rec.x||0),y=Math.round(rec.y||0);
    
    const lifted=tmtLayoutLift===el,lift=lifted?"1":"0";
    if(rec.f){
        if(rec.bx===undefined)tmtLayoutMeasureFloat(el,rec);
        const left=Math.round(rec.bx+x),top=Math.round(rec.by+y);
        const sig="A:"+left+","+top+","+lift;
        if(el.__tmtLay===sig)return;
        el.__tmtLay=sig;
        el.style.position="absolute";
        el.style.left=left+"px";
        el.style.top=top+"px";
        el.style.transform="";
        el.style.zIndex=lifted?"2147482000":"";
        return;
    }
    const sig="T:"+x+","+y+","+lift;
    if(el.__tmtLay===sig)return;
    el.__tmtLay=sig;
    el.style.position="";
    el.style.left="";
    el.style.top="";
    el.style.width="";
    el.style.height="";
    el.style.transform=(x||y)?"translate("+x+"px,"+y+"px)":"";
    el.style.zIndex=lifted?"2147482000":"";
}






function tmtLayoutMeasureFloat(el,rec){
    el.style.position="";el.style.left="";el.style.top="";el.style.transform="";el.style.width="";el.style.height="";
    const flow=el.getBoundingClientRect();
    
    if(flow.width)el.style.width=flow.width+"px";
    if(flow.height)el.style.height=flow.height+"px";
    el.style.position="absolute";el.style.left="0px";el.style.top="0px";
    const zero=el.getBoundingClientRect();
    
    
    rec.bx=flow.left-zero.left;
    rec.by=flow.top-zero.top;
}






function tmtLayoutStep(){
    tmtLayoutLoop=requestAnimationFrame(tmtLayoutStep);
    try{tmtLayoutFrame();}
    catch(e){if(typeof console!=="undefined")console.warn("[TMT-Live] layout",e);}
}

function tmtLayoutKick(){
    if(tmtLayoutLoop)return;
    if(typeof requestAnimationFrame!=="function"){tmtLayoutFrame();return;}
    tmtLayoutLoop=requestAnimationFrame(tmtLayoutStep);
}

function tmtLayoutFrame(){
    const recs=tmtLayoutRecsMap();
    if(!tmtLayoutBound)tmtLayoutBound=new Map();
    if(!tmtLayoutLost)tmtLayoutLost=new Set();

    
    const retry=[];
    tmtLayoutLost.clear();
    for(const [key,rec] of recs){
        let el=tmtLayoutBound.get(key);
        if(!el||!el.isConnected){
            el=tmtLayoutResolve(key,false);
            if(el)tmtLayoutBound.set(key,el);else retry.push(key);
        }
        if(el)tmtLayoutApply(el,rec);
        else tmtLayoutLost.add(key);
    }

    
    
    if(retry.length){
        if(!tmtLayoutVueIndex||Date.now()-tmtLayoutIndexAt>1000)tmtLayoutVueIndex=null;
        for(const key of retry){
            const rec=recs.get(key);
            if(!rec)continue;
            const el=tmtLayoutResolve(key,true);
            if(!el)continue;
            tmtLayoutBound.set(key,el);
            tmtLayoutLost.delete(key);
            tmtLayoutApply(el,rec);
        }
    }

    
    const d=tmtLayoutDrag;
    if(d&&!d.moved){
        
        if(Math.abs(tmtLayoutPtr.x-d.x0)+Math.abs(tmtLayoutPtr.y-d.y0)>=4){
            d.moved=true;
            tmtLayoutClaim(d);
        }
    }
    if(d&&d.moved&&d.rec){
        let el=tmtLayoutBound.get(d.key);
        if(!el||!el.isConnected){
            el=tmtLayoutResolve(d.key,true);
            if(el)tmtLayoutBound.set(d.key,el);
        }
        if(el){
            d.el=el;
            let nx=d.ox+(tmtLayoutPtr.x-d.x0),ny=d.oy+(tmtLayoutPtr.y-d.y0);
            if(d.snap){
                nx=Math.round(nx/TMT_LAYOUT_SNAP)*TMT_LAYOUT_SNAP;
                ny=Math.round(ny/TMT_LAYOUT_SNAP)*TMT_LAYOUT_SNAP;
            }
            d.rec.x=nx;d.rec.y=ny;
            tmtLayoutApply(el,d.rec);
        }
    }

    
    if(tmtLayoutOn||tmtLayoutLocateEl){
        let show=null;
        if(tmtLayoutOn)show=tmtLayoutDrag&&tmtLayoutDrag.moved?tmtLayoutDrag.el:tmtLayoutHover;
        else if(Date.now()<tmtLayoutLocateUntil)show=tmtLayoutLocateEl;
        tmtLayoutBox(show);
    }

    
    if(tmtLayoutOn&&!tmtLayoutDrag&&tmtLayoutPtr.dirty){
        tmtLayoutPtr.dirty=false;
        const el=tmtLayoutPick(tmtLayoutPtr.x,tmtLayoutPtr.y);
        if(el!==tmtLayoutHover){
            tmtLayoutHover=el;
            tmtLayoutHoverDirty();
        }
    }
}



function tmtLayoutBox(el){
    const box=document.getElementById("tmtLayoutBox");
    const tag=document.getElementById("tmtLayoutTag");
    if(!box||!tag)return;
    if(!el||!el.isConnected){
        if(box.style.display!=="none"){box.style.display="none";tag.style.display="none";}
        return;
    }
    
    const r=el.getBoundingClientRect();
    box.style.display="block";
    box.style.transform="translate("+Math.round(r.left)+"px,"+Math.round(r.top)+"px)";
    box.style.width=Math.round(r.width)+"px";
    box.style.height=Math.round(r.height)+"px";
    tag.style.display="block";
    tag.textContent=tmtLayoutSig(el);
    tag.style.transform="translate("+Math.round(r.left)+"px,"+Math.round(Math.max(0,r.top-16))+"px)";
}



function tmtLayoutOurUI(el){
    return !!(el&&el.closest&&el.closest(TMT_LAYOUT_OWN));
}

function tmtLayoutPickable(el){
    if(!el||el.nodeType!==1)return false;
    if(el===document.body||el===document.documentElement)return false;
    if(el.tagName==="HEAD"||el.tagName==="SCRIPT"||el.tagName==="STYLE")return false;
    if(tmtLayoutOurUI(el))return false;
    const cs=window.getComputedStyle(el);
    if(cs.display==="none"||cs.visibility==="hidden"||cs.opacity==="0")return false;
    return true;
}


function tmtLayoutPick(x,y){
    const root=tmtLayoutRoot();
    let el=document.elementFromPoint(x,y);
    if(!el||el===root)return null;
    for(let i=0;i<tmtLayoutGrab;i++){
        el=el.parentElement;
        if(!el||el===root)return null;
    }
    while(el&&el!==root){
        if(tmtLayoutPickable(el))return el;
        el=el.parentElement;
    }
    return null;
}


function tmtLayoutClaim(d){
    if(d.rec)return d.rec;
    const st=tmtLayoutStore(true);
    if(!st)return null;
    let rec=st[d.key];
    if(!rec){
        rec={s:tmtLayoutSig(d.el),x:0,y:0};
        st[d.key]=rec;
    }
    d.rec=rec;
    d.ox=rec.x;d.oy=rec.y;
    const recs=tmtLayoutRecsMap();
    recs.set(d.key,rec);
    tmtLayoutBound&&tmtLayoutBound.set(d.key,d.el);
    return rec;
}

function tmtLayoutRecordOf(el){
    const key=tmtLayoutAnchor(el);
    if(!key)return null;
    const st=tmtLayoutStore(false);
    return st&&st[key]?st[key]:null;
}





function tmtLayoutSwallow(e){
    if(!tmtLayoutOn)return;
    if(tmtLayoutOurUI(e.target))return;
    e.preventDefault();
    e.stopPropagation();
}

function tmtLayoutOnDown(e){
    if(!tmtLayoutOn)return;
    if(tmtLayoutOurUI(e.target))return;
    if(e.pointerType!=="touch"&&e.button!==0)return;
    
    
    e.preventDefault();
    e.stopPropagation();
    if(tmtLayoutDrag)return;
    const el=tmtLayoutPick(e.clientX,e.clientY);
    if(!el)return;
    const key=tmtLayoutAnchor(el);
    if(!key)return;
    const rec=tmtLayoutRecordOf(el);
    tmtLayoutHover=el;
    tmtLayoutLift=el;
    tmtLayoutDrag={
        key:key,rec:rec,el:el,
        x0:e.clientX,y0:e.clientY,ox:rec?rec.x:0,oy:rec?rec.y:0,
        moved:false,snap:!!e.shiftKey,
    };
    document.documentElement.classList.add("tmtLayoutDragging");
    tmtLayoutBox(el);
}

function tmtLayoutOnUp(){
    const d=tmtLayoutDrag;
    if(!d)return;
    tmtLayoutDrag=null;
    tmtLayoutLift=null;
    document.documentElement.classList.remove("tmtLayoutDragging");
    if(d.el)tmtLayoutClearStyle(d.el);
    if(!d.moved){
        tmtLayoutClick(d.el);
        return;
    }
    tmtLayoutPersist();
}

function tmtLayoutClick(el){
    if(!el||!el.isConnected)return;
    tmtLayoutClicks++;
    if(tmtLayoutClickTimer)clearTimeout(tmtLayoutClickTimer);
    tmtLayoutClickTimer=setTimeout(()=>{tmtLayoutClicks=0;},450);
    if(tmtLayoutClicks<2)return;
    tmtLayoutClicks=0;
    tmtLayoutReset(el);
}

function tmtLayoutOnMove(e){
    if(!tmtLayoutOn)return;
    if(tmtLayoutOurUI(e.target)&&!tmtLayoutDrag)return;
    tmtLayoutPtr.x=e.clientX;tmtLayoutPtr.y=e.clientY;tmtLayoutPtr.dirty=true;
    if(tmtLayoutDrag&&!!e.shiftKey!==tmtLayoutDrag.snap)tmtLayoutDrag.snap=!!e.shiftKey;
}

function tmtLayoutOnKey(e){
    if(!tmtLayoutOn)return;
    const tag=e.target&&e.target.tagName;
    
    if(e.target&&(e.target.isContentEditable||tag==="INPUT"||tag==="TEXTAREA"||tag==="SELECT"))return;
    if(e.key==="Escape"){
        const d=tmtLayoutDrag;
        if(d){
            if(d.rec){
                d.rec.x=d.ox;d.rec.y=d.oy;
                tmtLayoutApply(d.el,d.rec);
            }
            tmtLayoutDrag=null;tmtLayoutLift=null;
            document.documentElement.classList.remove("tmtLayoutDragging");
            return;
        }
        tmtLayoutSet(false);
        return;
    }
    if(tmtLayoutDrag)return;
    if(e.key==="["||e.key==="]"){
        tmtLayoutGrab=Math.max(0,Math.min(12,tmtLayoutGrab+(e.key==="["?-1:1)));
        tmtLayoutPtr.dirty=true;
        e.preventDefault();
        tmtLayoutHudSync();
    }
}


function tmtLayoutHotkey(e){
    if(!e.ctrlKey||!e.altKey)return;
    if(e.key!=="l"&&e.key!=="L")return;
    e.preventDefault();
    tmtLayoutSet(!tmtLayoutOn);
}



function tmtLayoutPersist(){
    try{if(typeof save==="function")save();}catch(e){}
    tmtLayoutHudSync();
    tmtLayoutPanelSync();
    tmtLayoutKick();
}

function tmtLayoutDropRecord(key){
    const st=tmtLayoutStore(false);
    if(!st||!(key in st))return;
    const el=(tmtLayoutBound&&tmtLayoutBound.get(key))||tmtLayoutResolve(key,false);
    delete st[key];
    const recs=tmtLayoutRecsMap();
    recs.delete(key);
    if(tmtLayoutBound)tmtLayoutBound.delete(key);
    if(tmtLayoutLost)tmtLayoutLost.delete(key);
    if(el)tmtLayoutClearStyle(el);
}

function tmtLayoutReset(el){
    if(!el)return;
    const key=tmtLayoutAnchor(el);
    if(!key)return;
    tmtLayoutDropRecord(key);
    tmtLayoutPersist();
    tmtLayoutFlash(tmtT("l_m_reset"));
}

function tmtLayoutToggleFloat(el){
    if(!el)return;
    const key=tmtLayoutAnchor(el);
    if(!key)return;
    const st=tmtLayoutStore(true);
    let rec=st[key];
    if(!rec){rec={s:tmtLayoutSig(el),x:0,y:0};st[key]=rec;}
    tmtLayoutRecsMap().set(key,rec);
    if(tmtLayoutBound)tmtLayoutBound.set(key,el);
    if(rec.f){
        rec.f=0;delete rec.bx;delete rec.by;
    }else{
        rec.f=1;
        
        
        tmtLayoutClearStyle(el);
    }
    tmtLayoutApply(el,rec);
    tmtLayoutPersist();
}

function tmtLayoutResetAll(){
    const st=tmtLayoutStore(false);
    if(st)for(const k of Object.keys(st))delete st[k];
    tmtLayoutInvalidate();
    
    for(const el of document.querySelectorAll("[style]")){
        if(el.__tmtLay!==undefined)tmtLayoutClearStyle(el);
    }
    tmtLayoutPersist();
}

function tmtLayoutClearAll(){
    if(!confirm(tmtT("m_confirmClearLayout")))return;
    tmtLayoutResetAll();
    tmtLayoutFlash(tmtT("l_m_cleared"));
}



function tmtLayoutStyle(){
    if(document.getElementById("tmtLayoutStyle"))return;
    const st=document.createElement("style");
    st.id="tmtLayoutStyle";
    st.textContent=
        "html.tmtLayoutMode,html.tmtLayoutMode body{cursor:grab;-webkit-user-select:none;user-select:none}"+
        "html.tmtLayoutMode.tmtLayoutDragging,html.tmtLayoutMode.tmtLayoutDragging body{cursor:grabbing}"+
        "#tmtLayoutBox{position:fixed;left:0;top:0;z-index:2147483000;pointer-events:none;box-sizing:border-box;"+
            "border:1px dashed #0ff;box-shadow:0 0 0 1px rgba(0,0,0,.45);display:none}"+
        "#tmtLayoutTag{position:fixed;left:0;top:0;z-index:2147483001;pointer-events:none;display:none;max-width:320px;"+
            "background:rgba(0,0,0,.85);color:#0ff;border:1px solid #0f0;border-radius:3px;"+
            "padding:0 4px;font:11px/16px monospace;overflow:hidden;white-space:nowrap}"+
        "#tmtLayoutHud{position:fixed;left:10px;bottom:10px;z-index:999999;min-width:250px;max-width:min(560px,92vw);"+
            "background:rgba(0,0,0,.88);color:#0f0;border:1px solid #0f0;border-radius:6px;padding:6px 8px;"+
            "font:12px/1.7 monospace;user-select:none;-webkit-user-select:none}"+
        "#tmtLayoutHud .tmtLHudTitle{color:#fff;font-weight:bold}"+
        "#tmtLayoutHud .tmtLHudHint{color:#9fd;opacity:.9}"+
        "#tmtLayoutHud .tmtLHudLine{color:#8fd;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}"+
        "#tmtLayoutHud button{background:#000;color:#0f0;border:1px solid #0f0;border-radius:4px;"+
            "margin:2px 3px 0 0;padding:0 6px;cursor:pointer;font:12px monospace}"+
        "#tmtLayoutHud button:hover:enabled{background:#0f0;color:#000}"+
        "#tmtLayoutHud button:disabled{color:#456;border-color:#234;cursor:default}"+
        "#tmtLayoutPanel{position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.55);z-index:1000000;"+
            "display:flex;align-items:center;justify-content:center;font:12px/1.7 monospace}"+
        "#tmtLayoutPanel .tmtLPPanel{background:#111;color:#ddd;border:1px solid #0f0;border-radius:8px;"+
            "padding:12px 14px;width:680px;max-width:94vw;max-height:84vh;display:flex;flex-direction:column;"+
            "box-shadow:0 4px 24px rgba(0,0,0,.6)}"+
        "#tmtLayoutPanel .tmtLPHead{color:#0f0;margin-bottom:6px}"+
        "#tmtLayoutPanel .tmtLPBody{overflow:auto;max-height:54vh;border:1px solid #234;border-radius:4px;padding:4px}"+
        "#tmtLayoutPanel .tmtLPRow{display:flex;gap:6px;align-items:center;padding:2px 0;border-bottom:1px dotted #234}"+
        "#tmtLayoutPanel .tmtLPSig{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#dfd}"+
        "#tmtLayoutPanel .tmtLPPos{color:#a86;flex-shrink:0;font-size:11px}"+
        "#tmtLayoutPanel .tmtLPLost{color:#f66;flex-shrink:0;font-size:11px}"+
        "#tmtLayoutPanel button{background:#000;color:#0f0;border:1px solid #0f0;border-radius:4px;"+
            "padding:0 6px;cursor:pointer;font:11px monospace;flex-shrink:0}"+
        "#tmtLayoutPanel button:hover{background:#0f0;color:#000}"+
        "#tmtLayoutPanel .tmtLPFoot{margin-top:8px;text-align:right}"+
        "#tmtLayoutPanel .tmtLPTip{color:#999;font-size:11px;margin:6px 0 0}";
    (document.head||document.documentElement).appendChild(st);
}

function tmtLayoutBtn(parent,text,fn,disabled){
    const b=document.createElement("button");
    b.textContent=text;
    
    b.toggleAttribute("disabled",!!disabled);
    if(!disabled)b.onclick=(e)=>{e.stopPropagation();fn();};
    parent.appendChild(b);
    return b;
}

function tmtLayoutBuildHud(){
    const old=document.getElementById("tmtLayoutHud");
    if(old)old.remove();
    if(!tmtLayoutOn)return;
    const hud=document.createElement("div");
    hud.id="tmtLayoutHud";
    hud.innerHTML=
        '<div class="tmtLHudTitle"></div>'+
        '<div class="tmtLHudHint"></div>'+
        '<div class="tmtLHudLine tmtLHudHover"></div>'+
        '<div class="tmtLHudLine tmtLHudStat"></div>'+
        '<div class="tmtLHudBtns"></div>';
    (document.body||document.documentElement).appendChild(hud);
    const btns=hud.querySelector(".tmtLHudBtns");
    tmtLayoutBtn(btns,tmtT("l_btnPanel"),tmtLayoutOpenPanel);
    tmtLayoutBtn(btns,tmtT("l_btnReset"),()=>tmtLayoutReset(tmtLayoutHover),!tmtLayoutHover);
    tmtLayoutBtn(btns,tmtT("l_btnFloat"),()=>tmtLayoutToggleFloat(tmtLayoutHover),!tmtLayoutHover);
    tmtLayoutBtn(btns,tmtT("l_btnExit"),()=>tmtLayoutSet(false));
    tmtLayoutHudSync();
}

function tmtLayoutHudSync(){
    const hud=document.getElementById("tmtLayoutHud");
    if(!hud)return;
    hud.querySelector(".tmtLHudTitle").textContent=tmtT("l_title")+" — "+tmtT(tmtLayoutOn?"l_stateOn":"l_stateOff");
    hud.querySelector(".tmtLHudHint").textContent=tmtT("l_hint");
    hud.querySelector(".tmtLHudHover").textContent=
        tmtLayoutHover?tmtT("l_hintEl",{S:tmtLayoutSig(tmtLayoutHover)}):tmtT("l_hintNone");
    const recs=tmtLayoutRecs?Array.from(tmtLayoutRecs.values()):[];
    const moved=recs.filter(r=>r.x||r.y||r.f).length;
    hud.querySelector(".tmtLHudStat").textContent=tmtT("l_grab",{N:tmtLayoutGrab})+" · "+tmtT("l_moved",{N:moved});
    const btns=hud.querySelectorAll(".tmtLHudBtns button");
    if(btns[1])btns[1].toggleAttribute("disabled",!tmtLayoutHover);
    if(btns[2])btns[2].toggleAttribute("disabled",!tmtLayoutHover);
}

let tmtLayoutHoverSyncPending=false;
function tmtLayoutHoverDirty(){
    if(tmtLayoutHoverSyncPending)return;
    tmtLayoutHoverSyncPending=true;
    setTimeout(()=>{
        tmtLayoutHoverSyncPending=false;
        tmtLayoutHudSync();
        tmtLayoutPanelSync();
    },150);
}

function tmtLayoutFlash(msg){
    const head=document.querySelector("#tmtLiveBar .tmtLiveHead");
    if(!head)return;
    const old=head.textContent;
    head.textContent=msg;
    if(tmtLayoutFlashTimer)clearTimeout(tmtLayoutFlashTimer);
    tmtLayoutFlashTimer=setTimeout(()=>{head.textContent=old;},1200);
}



function tmtLayoutOpenPanel(){
    if(document.getElementById("tmtLayoutPanel")){tmtLayoutClosePanel();return;}
    const overlay=document.createElement("div");
    overlay.id="tmtLayoutPanel";
    const panel=document.createElement("div");
    panel.className="tmtLPPanel";
    const head=document.createElement("div");
    head.className="tmtLPHead";
    const body=document.createElement("div");
    body.className="tmtLPBody";
    const tip=document.createElement("div");
    tip.className="tmtLPTip";
    tip.textContent=tmtT("l_p_hint");
    const foot=document.createElement("div");
    foot.className="tmtLPFoot";
    panel.appendChild(head);panel.appendChild(body);panel.appendChild(tip);panel.appendChild(foot);
    overlay.appendChild(panel);
    (document.body||document.documentElement).appendChild(overlay);
    overlay.addEventListener("click",(e)=>{if(e.target===overlay)tmtLayoutClosePanel();});
    const mk=(text,fn)=>{
        const b=document.createElement("button");
        b.textContent=text;
        b.style.marginLeft="6px";
        b.onclick=()=>{fn();tmtLayoutPanelSync();};
        foot.appendChild(b);
    };
    mk(tmtT("l_btnResetAll"),()=>{
        if(confirm(tmtT("m_confirmResetAllLayout"))){tmtLayoutResetAll();tmtLayoutFlash(tmtT("l_m_resetAll"));}
    });
    mk(tmtT("l_p_clear"),tmtLayoutClearAll);
    mk(tmtT("e_close"),tmtLayoutClosePanel);
    tmtLayoutPanelSync();
}

function tmtLayoutClosePanel(){
    const p=document.getElementById("tmtLayoutPanel");
    if(p)p.remove();
}

function tmtLayoutPanelSync(){
    const p=document.getElementById("tmtLayoutPanel");
    if(!p)return;
    const recs=tmtLayoutRecsMap();
    const lost=tmtLayoutLost||new Set();
    p.querySelector(".tmtLPHead").textContent=tmtT("l_p_title",{N:recs.size});
    const body=p.querySelector(".tmtLPBody");
    body.innerHTML="";
    if(recs.size===0){
        const empty=document.createElement("div");
        empty.style.color="#999";
        empty.textContent=tmtT("l_p_empty");
        body.appendChild(empty);
        return;
    }
    for(const [key,rec] of recs){
        const row=document.createElement("div");
        row.className="tmtLPRow";
        const sig=document.createElement("div");
        sig.className="tmtLPSig";
        sig.textContent=rec.s||key;
        sig.title=key;
        row.appendChild(sig);
        const pos=document.createElement("div");
        pos.className="tmtLPPos";
        pos.textContent=(rec.x||rec.y||rec.f)
            ?tmtT("l_p_off",{X:Math.round(rec.x||0),Y:Math.round(rec.y||0)})+(rec.f?(" "+tmtT("l_p_floatOn")):"")
            :tmtT("l_p_zero");
        row.appendChild(pos);
        if(lost.has(key)){
            const l=document.createElement("div");
            l.className="tmtLPLost";
            l.textContent=tmtT("l_p_gone");
            row.appendChild(l);
        }
        tmtLayoutBtn(row,tmtT("l_btnFloat"),()=>tmtLayoutToggleFloat(tmtLayoutBound.get(key)||tmtLayoutResolve(key,true)));
        tmtLayoutBtn(row,tmtT("l_btnLocate"),()=>tmtLayoutLocate(key));
        tmtLayoutBtn(row,tmtT("e_deleteTip"),()=>{tmtLayoutDropRecord(key);tmtLayoutPersist();});
        body.appendChild(row);
    }
}

function tmtLayoutLocate(key){
    const el=tmtLayoutResolve(key,true);
    if(!el){tmtLayoutFlash(tmtT("l_p_gone"));return;}
    tmtLayoutHover=el;
    tmtLayoutLocateEl=el;
    tmtLayoutLocateUntil=Date.now()+2400;
    tmtLayoutKick();
}



function tmtLayoutChrome(){
    if(document.getElementById("tmtLayoutBox"))return;
    const box=document.createElement("div");
    box.id="tmtLayoutBox";
    const tag=document.createElement("div");
    tag.id="tmtLayoutTag";
    const host=document.body||document.documentElement;
    host.appendChild(box);
    host.appendChild(tag);
}

function tmtLayoutSet(on){
    tmtLayoutOn=!!on;
    tmtLayoutStyle();
    tmtLayoutChrome();
    const html=document.documentElement;
    if(on){
        html.classList.add("tmtLayoutMode");
        html.classList.remove("tmtLayoutDragging");
    }else{
        html.classList.remove("tmtLayoutMode");
        html.classList.remove("tmtLayoutDragging");
        tmtLayoutHover=null;
        const d=tmtLayoutDrag;
        tmtLayoutDrag=null;
        if(d){tmtLayoutLift=null;if(d.el)tmtLayoutClearStyle(d.el);}
        tmtLayoutBox(null);
        const hud=document.getElementById("tmtLayoutHud");
        if(hud)hud.remove();
        tmtLayoutClosePanel();
    }
    tmtLayoutBuildHud();
    const btn=document.querySelector('#tmtLiveBar [data-act="layout"]');
    if(btn){btn.style.background=on?"#0f0":"";btn.style.color=on?"#000":"";}
    tmtLayoutKick();
    tmtLayoutHudSync();
}

function tmtLayoutToggle(){
    tmtLayoutSet(!tmtLayoutOn);
}

function tmtLayoutIsOn(){
    return tmtLayoutOn;
}


function tmtLayoutRefreshUI(){
    const wasOpen=!!document.getElementById("tmtLayoutPanel");
    tmtLayoutClosePanel();
    tmtLayoutBuildHud();
    if(wasOpen)tmtLayoutOpenPanel();
}



function tmtLayoutBoot(){
    if(tmtLayoutBooted)return;
    if(typeof document==="undefined")return;
    if(!document.getElementById("app"))return;
    tmtLayoutBooted=true;
    tmtLayoutStyle();

    for(const type of ["mouseup","click","dblclick","auxclick","touchend"])window.addEventListener(type,tmtLayoutSwallow,true);
    window.addEventListener("pointermove",tmtLayoutOnMove,true);
    document.addEventListener("pointerdown",tmtLayoutOnDown,true);
    window.addEventListener("pointerup",tmtLayoutOnUp,true);
    window.addEventListener("pointercancel",tmtLayoutOnUp,true);
    document.addEventListener("keydown",tmtLayoutOnKey,true);
    document.addEventListener("keydown",tmtLayoutHotkey,true);

    tmtLayoutKick();
}

if(typeof document!=="undefined"){
    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",tmtLayoutBoot);
    else tmtLayoutBoot();
}









function tmtPtrFrom(path){
	const m=path.match(/^(?:tmp|layers)\[(\w+)\]\.(.+)$/);
	if(!m)return null;
	let out=m[1];
	const rest=m[2].replace(/\[(\w+)\]/g,".$1");
	for(const seg of rest.split(".")){
		if(!seg)return null;
		if(seg===m[1]||seg==="data"||seg==="id"||seg==="family")out+=`+"-" + ${seg}`;
		else out+=`+"-${seg}"`;
	}
	return out;
}


function tmtSurgeryRules(){
	const UP="tmp\\[layer\\]\\.upgrades\\[data\\]", LUP="layers\\[layer\\]\\.upgrades\\[data\\]";
	const MI="tmp\\[layer\\]\\.milestones\\[data\\]", LMI="layers\\[layer\\]\\.milestones\\[data\\]";
	const CH="tmp\\[layer\\]\\.challenges\\[data\\]";
	const BU="tmp\\[layer\\]\\.buyables\\[data\\]", CL="tmp\\[layer\\]\\.clickables\\[data\\]";
	const ed=(p1)=>`<editable :data="${p1}" :ptr='${tmtPtrFrom(p1)}'></editable>`;
	return {
		"upgrade": [
			{re:new RegExp(`<h3 v-html="(${UP}\\.title)"></h3>`,"g"),fn:(m,p1)=>`<h3>${ed(p1)}</h3>`},
			{re:new RegExp(`<span v-html="(${UP}\\.description)"></span>`,"g"),fn:(m,p1)=>ed(p1)},
			{re:new RegExp(`\\{\\{\\s*formatWhole\\((${UP}\\.cost)\\)\\s*\\}\\}`,"g"),fn:(m,p1)=>`<editable :data="formatWhole(${p1})" :ptr='${tmtPtrFrom(p1)}'></editable>`},
			{re:new RegExp(`<span v-html="run\\((${LUP}\\.effectDisplay), ${LUP}\\)"></span>`,"g"),fn:(m,p1)=>ed(p1)},
		],
		"milestone": [
			{re:new RegExp(`<h3 v-html="(${MI}\\.requirementDescription)"></h3>`,"g"),fn:(m,p1)=>`<h3>${ed(p1)}</h3>`},
			{re:new RegExp(`<span v-html="(${MI}\\.effectDescription)"></span>`,"g"),fn:(m,p1)=>ed(p1)},
			{re:new RegExp(`<span v-html="run\\((${LMI}\\.effectDescription), ${LMI}\\)"></span>`,"g"),fn:(m,p1)=>ed(p1)},
		],
		"challenge": [
			{re:new RegExp(`<h3 v-html="(${CH}\\.name)"></h3>`,"g"),fn:(m,p1)=>`<h3>${ed(p1)}</h3>`},
		],
		"buyable": [
			{re:new RegExp(`<h2 v-html="(${BU}\\.title)"></h2>`,"g"),fn:(m,p1)=>`<h2>${ed(p1)}</h2>`},
		],
		"clickable": [
			{re:new RegExp(`<h2 v-html="(${CL}\\.title)"></h2>`,"g"),fn:(m,p1)=>`<h2>${ed(p1)}</h2>`},
		],
		"main-display": [
			{re:new RegExp(`\\{\\{(tmp\\[layer\\]\\.resource)\\}\\}`,"g"),fn:(m,p1)=>ed(p1)},
		],
		"infobox": [
			
			{re:new RegExp(`<span v-html="(tmp\\[layer\\]\\.infoboxes\\[data\\]\\.title\\s*\\?\\s*tmp\\[layer\\]\\.infoboxes\\[data\\]\\.title\\s*:\\s*\\(tmp\\[layer\\]\\.name\\))"></span>`,"g"),
			 fn:()=>`<editable :data="tmp[layer].infoboxes[data].title || tmp[layer].name || ''" :ptr='layer+"-infoboxes-"+data+"-title"'></editable>`},
			{re:new RegExp(`<span v-html="(tmp\\[layer\\]\\.infoboxes\\[data\\]\\.body\\s*\\?\\s*tmp\\[layer\\]\\.infoboxes\\[data\\]\\.body\\s*:\\s*'[^']*')"></span>`,"g"),
			 fn:()=>`<editable :data="tmp[layer].infoboxes[data].body || ''" :ptr='layer+"-infoboxes-"+data+"-body"'></editable>`},
		],
	};
}


function tmtPatchTemplate(name,template){
	const rules=tmtSurgeryRules()[name];
	if(!rules||!template)return null;
	let tpl=template,changed=false;
	for(const rule of rules){
		tpl=tpl.replace(rule.re,(...a)=>{
			changed=true;
			return rule.fn(...a);
		});
	}
	return changed?tpl:null;
}

const TMT_LIVE_EDITABLE_COMP={
	props:['data','ptr'],
	
	methods:{tmtPh(){return tmtT("e_clickToEnter");}},
	template:`
		<span v-html="data==''?tmtPh():data" contenteditable="true"
		 onfocus="editableOnFocus(this)"
		 onblur="editableOnBlur(this)"></span>
	`
};



function tmtCleanDef(def,tpl){
	const clean={name:def.name};
	for(const k of ["props","propsData","computed","methods","data","watch","components","directives","filters","model","inheritAttrs","delimiters"]){
		if(def[k]!==undefined)clean[k]=def[k];
	}
	clean.template=tpl;
	return clean;
}

function tmtLivePatchNow(){
	const V=window.Vue;
	if(!V)return [];
	const comps=V.options&&V.options.components?V.options.components:{};
	const patched=[];
	for(const name in comps){
		const def=comps[name];
		if(!def||!def.options||!def.options.template)continue;
		try{
			const tpl=tmtPatchTemplate(name,def.options.template);
			if(tpl!==null){V.component(name,tmtCleanDef(def.options,tpl));patched.push(name);}
		}catch(e){}
	}
	return patched;
}



function tmtLiveForceRerender(patchedNames){
	const V=window.Vue;
	if(!V||!V.compile||!window.app||!patchedNames.length)return;
	const walk=(inst)=>{
		if(!inst.$children)return;
		for(const child of inst.$children){
			try{
				const opts=child.$vnode&&child.$vnode.componentOptions;
				const tag=opts&&opts.tag;
				if(tag&&patchedNames.indexOf(tag)>=0){
					const newDef=V.options.components[tag];
					const tpl=newDef&&newDef.options&&newDef.options.template;
					if(tpl){
						const compiled=V.compile(tpl);
						child.$options.render=compiled.render;
						child.$options.staticRenderFns=compiled.staticRenderFns;
						child.$forceUpdate();
					}
				}
			}catch(e){}
			walk(child);
		}
	};
	try{walk(window.app);}catch(e){}
}

function tmtLiveHookComponents(){
	const V=window.Vue;
	if(!V)return;
	V.component("editable",TMT_LIVE_EDITABLE_COMP);
	if(window.app){
		const patched=tmtLivePatchNow();
		tmtLiveForceRerender(patched);
		console.log("[TMT-Live]",tmtT("c_patchedRunning"),patched.join(", "));
		return;
	}
	if(V.__tmtLiveHooked)return;
	V.__tmtLiveHooked=true;
	const orig=V.component.bind(V);
	const patchedNames=[];
	
	V.component=function(name,def){
		const r=orig(name,def);
		try{
			const tpl=def&&def.template?tmtPatchTemplate(name,def.template):null;
			if(tpl!==null){orig(name,tmtCleanDef(def,tpl));if(patchedNames.indexOf(name)<0)patchedNames.push(name);}
		}catch(e){}
		return r;
	};
	console.log("[TMT-Live]",tmtT("c_hooked"));
}

function tmtLiveFlash(msg){
	
	const head=document.querySelector("#tmtLiveBar .tmtLiveHead");
	if(!head)return;
	const old=head.textContent;
	head.textContent=msg;
	setTimeout(()=>{head.textContent=old;},1200);
}

function tmtLiveCurrentLayer(){
	try{
		if(typeof player==="undefined"||!player)return null;
		if(player.tab&&player.tab!=="none"&&player.tab!=="none-tab")return player.tab;
		if(player.navTab&&player.navTab!=="none")return player.navTab;
	}catch(e){}
	return null;
}


function tmtLiveBarButtons(){
	return '<button data-act="editor">'+tmtT("b_editor")+'</button>'+
		'<button data-act="add">'+tmtT("b_add")+'</button>'+
		'<button data-act="layout" title="'+tmtT("l_hint")+'">'+tmtT("b_layout")+'</button>'+
		'<button data-act="export">'+tmtT("b_export")+'</button>'+
		'<button data-act="exportjs">'+tmtT("b_exportJs")+'</button>'+
		'<button data-act="import">'+tmtT("b_import")+'</button>'+
		'<button data-act="clear">'+tmtT("b_clear")+'</button>'+
		'<button data-act="lang" title="'+tmtT("m_toggleLang")+'">'+tmtT("b_lang")+'</button>';
}

function tmtLiveBuildBar(){
	if(document.getElementById("tmtLiveBar"))return;
	const st=document.createElement("style");
	st.textContent=
		".tmtLiveBar{position:fixed;right:10px;bottom:10px;z-index:999999;font:12px/1.9 monospace;"+
		"background:rgba(0,0,0,.8);color:#0f0;border:1px dashed #fff;padding:2px 8px;border-radius:6px;user-select:none}"+
		".tmtLiveBar .tmtLiveHead{cursor:pointer;color:#fff;opacity:.85}"+
		".tmtLiveBar .tmtLiveHead:hover{color:#0f0}"+
		".tmtLiveBar button{background:#000;color:#0f0;border:1px solid #0f0;border-radius:4px;margin:1px 2px;padding:1px 6px;cursor:pointer;font:12px monospace}"+
		".tmtLiveBar button:hover{background:#0f0;color:#000}"+
		".tmtLiveBar.collapsed .tmtLiveBody{display:none}";
	document.head.appendChild(st);
	const bar=document.createElement("div");
	bar.id="tmtLiveBar";
	bar.className="tmtLiveBar collapsed";
	bar.innerHTML=
		'<span class="tmtLiveHead">TMT Live ▸</span>'+
		'<span class="tmtLiveBody">'+tmtLiveBarButtons()+'</span>';
	bar.addEventListener("click",function(e){
		const t=e.target;
		if(t&&t.classList&&t.classList.contains("tmtLiveHead")){
			bar.classList.toggle("collapsed");
			t.textContent=bar.classList.contains("collapsed")?"TMT Live ▸":"TMT Live ▾";
			return;
		}
		const act=t&&t.dataset&&t.dataset.act;
		if(!act)return;
		if(act==="editor"){
			tmtOpenEditor(tmtLiveCurrentLayer());
		}
		else if(act==="add"){
			const layer=tmtLiveCurrentLayer();
			if(!layer){alert(tmtT("m_enterLayerFirst"));return;}
			addComponentDialog(layer);
		}
		else if(act==="layout"){
			tmtLayoutToggle();
		}
		else if(act==="export"){
			tmtCopyText(modToJSON(window.mod||{}));
			tmtLiveFlash(tmtT("m_copied"));
		}
		else if(act==="exportjs"){
			tmtCopyText(get_layer_js());
			tmtLiveFlash(tmtT("m_layerJsCopied"));
		}
		else if(act==="import"){
			const s=prompt(tmtT("m_pasteJson"));
			if(s&&importModString(s)){
				try{save();}catch(e2){}
				window.location.reload();
			}
		}
		else if(act==="lang"){
			
			tmtToggleLang();
			tmtLiveApplyLang();
		}
		else if(act==="clear"){
			if(confirm(tmtT("m_confirmClear"))){
				
				window.mod={};
				try{localStorage.removeItem(tmtLiveKey());}catch(e){}
				try{save();}catch(e){}
				try{localStorage.removeItem(tmtLiveKey());}catch(e){}
				window.location.reload();
			}
		}
	});
	(document.body||document.documentElement).appendChild(bar);
}

function tmtLiveToggleBar(){
	const bar=document.getElementById("tmtLiveBar");
	if(bar)bar.style.display=bar.style.display==="none"?"":"none";
}


function tmtLiveApplyLang(){
	const bar=document.getElementById("tmtLiveBar");
	if(bar){
		const body=bar.querySelector(".tmtLiveBody");
		if(body)body.innerHTML=tmtLiveBarButtons();
	}
	const ed=document.getElementById("tmtEditor");
	if(ed)ed.remove();
	if(typeof tmtLayoutRefreshUI==="function")tmtLayoutRefreshUI();
}

function tmtLiveKey(){
	let id="unknown";
	try{
		if(typeof modInfo!=="undefined")id=modInfo.id||modInfo.name||"unknown";
	}catch(e){}
	return "tmtlive_"+String(id).replace(/\s+/g,"-")+"_mod";
}

function tmtLiveIsTMT(){
	try{
		if(!window.Vue||!window.layers||typeof addLayer!=="function")return false;
		if(String(window.Vue.version).indexOf("2.")!==0)return false;
		if(typeof modInfo==="undefined")return false;
		return true;
	}catch(e){return false}
}

function tmtLiveApplySaved(){
	let raw=null;
	try{raw=localStorage.getItem(tmtLiveKey());}catch(e){}
	if(!raw)return;
	const edits=modFromJSON(raw);
	window.mod=edits;
	applyEdits(edits);
	console.log("[TMT-Live]",tmtT("c_applySaved"));
}

function tmtLiveBoot(){
	if(window.__TMT_LIVE_DONE__)return;
	if(!tmtLiveIsTMT())return;
	window.__TMT_LIVE_DONE__=true;
	if(typeof window.editableOnFocus!=="undefined"){
		
		console.log("[TMT-Live]",tmtT("c_skipFork"));
		return;
	}
	console.log("[TMT-Live]",tmtT("c_detected",{V:window.Vue.version,F:(typeof funcs!=="undefined"&&funcs)?"yes":"no"}));

	
	window.editableOnFocus=editableOnFocus;
	window.editableOnBlur=editableOnBlur;
	window.deleteMod=deleteMod;
	window.addComponent=addComponent;
	window.addComponentDialog=addComponentDialog;
	window.tmtInsertComponent=tmtInsertComponent;
	window.tmtOpenEditor=tmtOpenEditor;
	window.tmtEditField=tmtEditField;
	window.tmtDeleteField=tmtDeleteField;
	window.tmtMoveField=tmtMoveField;
	window.tmtNewItem=tmtNewItem;
	window.tmtAddField=tmtAddField;
	window.tmtAfterEdit=tmtAfterEdit;
	window.importModString=importModString;
	window.applyEdits=applyEdits;
	window.modToJSON=modToJSON;
	window.modFromJSON=modFromJSON;
	window.modstringify=modstringify;
	window.get_layer_js=get_layer_js;
	window.tmtCopyText=tmtCopyText;
	window.tmtLiveToggleBar=tmtLiveToggleBar;
	window.tmtLiveKey=tmtLiveKey;
	window.tmtT=tmtT;
	window.tmtToggleLang=tmtToggleLang;
	window.tmtApplyLang=tmtLiveApplyLang;

	
	window.tmtLayoutToggle=tmtLayoutToggle;
	window.tmtLayoutSet=tmtLayoutSet;
	window.tmtLayoutIsOn=tmtLayoutIsOn;
	window.tmtLayoutOpenPanel=tmtLayoutOpenPanel;
	window.tmtLayoutResetAll=tmtLayoutResetAll;
	window.tmtLayoutRefreshUI=tmtLayoutRefreshUI;

	tmtLiveBuildBar();
	tmtLayoutBoot();

	
	
	if(typeof load==="function"&&!load.__tmtLive&&!(window.tmp&&window.player)){
		const origLoad=load;
		window.load=function(){
			try{tmtLiveApplySaved();}catch(e){console.error("[TMT-Live]",tmtT("c_preApplyFail"),e);}
			const r=origLoad.apply(this,arguments);
			return r;
		};
		window.load.__tmtLive=true;
	}else{
		
			try{tmtLiveApplySaved();}catch(e){console.error("[TMT-Live]",tmtT("c_applyFail"),e);}
	}

	
	if(typeof save==="function"&&!save.__tmtLive){
		const origSave=save;
		window.save=function(){
			const r=origSave.apply(this,arguments);
			try{localStorage.setItem(tmtLiveKey(),modToJSON(window.mod||{}));}catch(e){}
			return r;
		};
		window.save.__tmtLive=true;
	}

	tmtLiveHookComponents();
	console.log("[TMT-Live]",tmtT("c_done"));
}

tmtLiveBoot();
	} 

	
	function injectPageCode() {
		const src = "(" + __tmtLivePageCode.toString() + ")();";
		if (!IN_SANDBOX) {
			
			(0, eval)(src);
			return;
		}
		try {
			const s = document.createElement("script");
			s.textContent = src;
			(document.head || document.documentElement).appendChild(s);
			s.remove();
			if (!W.__TMT_LIVE_DONE__) throw new Error("script tag blocked");
		} catch (e) {
			try {
				W.eval(src);
			} catch (e2) {
				console.error("[TMT-Live] inject failed 注入页面失败", e2);
			}
		}
	}

	
	
	function sandboxBoot() {
		
		let maybeTMT = false;
		try {
			maybeTMT = !!(W.Vue && W.layers && String(W.Vue.version).indexOf("2.") === 0);
		} catch (e) {}
		if (maybeTMT) injectPageCode();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", sandboxBoot);
	} else {
		sandboxBoot();
	}

	
	
	function gmLabels() {
		let lang = null;
		try { lang = W.localStorage.getItem("tmtlive_lang"); } catch (e) {}
		if (lang !== "zh" && lang !== "en") {
			try { lang = /^zh/i.test(navigator.language || "") ? "zh" : "en"; } catch (e) { lang = "en"; }
		}
		return lang === "zh"
			? { panel: "TMT Live：显示/隐藏编辑面板", lang: "切换到 English", layout: "TMT Live：自由拖拽布局（开关）" }
			: { panel: "TMT Live: show/hide editor panel", lang: "Switch to 中文", layout: "TMT Live: drag-to-arrange layout (toggle)" };
	}

	
	
	function gmToggleLang() {
		let next = null;
		try { if (typeof W.tmtToggleLang === "function") next = W.tmtToggleLang(); } catch (e) {}
		if (next !== "zh" && next !== "en") {
			let cur = null;
			try { cur = W.localStorage.getItem("tmtlive_lang"); } catch (e) {}
			next = (cur === "en") ? "zh" : (cur === "zh") ? "en"
				: ((/^zh/i.test(navigator.language || "")) ? "en" : "zh");
			try { W.localStorage.setItem("tmtlive_lang", next); } catch (e) {}
		}
		try { if (typeof W.tmtApplyLang === "function") W.tmtApplyLang(); } catch (e) {}
	}

	let gmCmdIds = [];
	function registerMenus() {
		if (typeof GM_registerMenuCommand !== "function") return;
		if (typeof GM_unregisterMenuCommand === "function") {
			for (const id of gmCmdIds) { try { GM_unregisterMenuCommand(id); } catch (e) {} }
		}
		gmCmdIds = [];
		const t = gmLabels();
		gmCmdIds.push(GM_registerMenuCommand(t.panel, function () {
			try { if (W.tmtLiveToggleBar) W.tmtLiveToggleBar(); } catch (e) {}
		}));
		gmCmdIds.push(GM_registerMenuCommand(t.lang, function () {
			gmToggleLang();
			registerMenus();
		}));
		gmCmdIds.push(GM_registerMenuCommand(t.layout, function () {
			try { if (W.tmtLayoutToggle) W.tmtLayoutToggle(); } catch (e) {}
		}));
	}
	registerMenus();
})();
