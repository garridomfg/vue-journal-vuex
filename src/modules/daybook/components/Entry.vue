<template>
  <div @click="$router.push({name: 'entry', params: {id: 10}})" class="entry-container mb-3 pointer p-2">
    <div class="entry-title d-flex">
      <span class="text-success fs-5 fw-bold">15</span>
      <span class="mx-1 fs-5">Julio</span>
      <span class="mx-2 fw-light">2021, jueves</span>
    </div>
    <div class="entry-description">
      Et consectetur incididunt ex nostrud dolore incididunt deserunt amet
      cillum. Commodo ipsum amet veniam anim consectetur veniam deserunt anim.
      Aliquip voluptate qui nisi anim ex qui adipisicing. Adipisicing
      consectetur veniam labore cupidatat. Commodo veniam irure reprehenderit
      velit qui ex dolore cillum fugiat.
    </div>
  </div>
</template>

<style lang="scss" scoped>
.entry-container {
  border-bottom: 1px solid #2c3e50;
  transition: 0.2s all ease-in;

  &:hover {
    background-color: lighten($color: grey, $amount: 45);
    transition: 0.2s all ease-in;
  }
  .entry-description {
    font-size: 12px;
  }
}
</style>
