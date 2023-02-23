<script setup>
</script>

<template>
  <div id="menu">
    <div style="margin-left: 10px">
      <a>首页</a>
      <a>操作</a>
      <a>设置</a>
      <a>编辑</a>
      <a>导入</a>
      <a>导出</a>
    </div>
  </div>
  <div id="left-menu-frame">
    <div id="left-menu">
      <a>首页</a>
      <a>操作</a>
      <a>设置</a>
      <a>编辑</a>
      <a>导入</a>
      <a>导出</a>
    </div>
  </div>
</template>


<style>
#menu {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30px;
  border-bottom: 5px solid #333;
  background-color: #444;
  display: flex;
  align-items: center;
}
#menu a {
  color: #d5d5d5;
  font-size: 14px;
  padding: 2px 10px;
}
#menu a:hover {
  background: #333;
  cursor: pointer;
}

#left-menu-frame {
  top: 35px;
  height: calc(100% - 35px);
  position: absolute;
  left: 0;
  display: flex;
  justify-content: center;
}

#left-menu {
  background-color: #444;
  display: flex;
  flex-direction: column;
}
#left-menu a {
  color: #d5d5d5;
  font-size: 14px;
  padding: 20px 10px;
}
#left-menu a:hover {
  background: #333;
  cursor: pointer;
}
</style>