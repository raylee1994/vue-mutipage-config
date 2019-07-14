<template>
    <div class="container">
        <navigation></navigation> 
        page: second_children
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
    display: flex;
}
</style>