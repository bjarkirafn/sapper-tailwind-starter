<style>
  h1,
  figure,
  p {
    text-align: center;
    margin: 0 auto;
  }
  /*
  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
    @apply text-green-500;
  } */

  figure {
    margin: 0 0 1em 0;
  }

  img {
    width: 100%;
    max-width: 400px;
    margin: 0 0 1em 0;
  }

  p {
    margin: 1em auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
  /* .svelte-style {
    @apply shadow-2xl text-center rounded-full;
  } */
</style>

<!-- <script>
  import Tailwind from '@layout/Tailwind.svelte'
</script> -->

<!-- <Tailwind /> -->

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<h1 class="uppercase text-6xl text-green-500 font-black">Great success!!</h1>

<figure class="flex items-center flex-col">
  <img class="p-4" alt="Borat" src="great-success.png" />
  <figcaption>HIGH FIVE!</figcaption>
</figure>

<p>
  <strong>
    Try editing this file (src/routes/index.svelte) to test live reloading.
  </strong>
</p>
