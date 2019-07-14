<template>
    <div class="container">
        <navigation></navigation> <br>
        <a href="second/second_children.html">second_children</a>
        page: second
    </div>      
</template>

<script>
import navigation from "components/nav";

export default {
    components: {
        navigation
    }
}
</script>

<style lang="less" scoped>
.container{
    background: red;
}
</style>