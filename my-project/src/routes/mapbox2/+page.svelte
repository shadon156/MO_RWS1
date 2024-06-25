<script>
    import Map2 from "$lib/Map2.svelte";
    import Boat from "$lib/Boat.svelte";
</script>

<div class="relative w-full h-screen">
    <div class="absolute inset-0">
        <Map2 />
    </div>
    <div class="absolute inset-0 pointer-events-none">
        <Boat />
    </div>
</div>
