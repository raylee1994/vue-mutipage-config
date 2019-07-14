<template>
    <div class="container">
        <navigation></navigation> 
        page: {{title}}
        <img src="@/img/logo.png">
    </div>      
</template>

<script>
import navigation from "components/nav";

export default {
    components: {
        navigation
    },
    data() {
        return {
            title: "index-page",
        }
    }
}
</script>

<style lang="less" scoped>
.container{
    background: red;
    div{
        font-size: 12px;
        box-sizing: border-box;
    }
}
</style>