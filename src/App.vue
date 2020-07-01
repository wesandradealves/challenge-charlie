 <template>
  <div
    id="wrap"
    :class="[
      ($route.meta.slug !== undefined) ? 'pg-' + $route.meta.slug : '',
      this.$route.meta.slug && this.$route.meta.slug !== 'home' ? 'pg-interna' : ''
    ]"
  >
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>
<script>
export default {
  name: "App",
};
</script>

<style lang="sass">
@import './_style'
</style>
