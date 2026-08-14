<script lang="ts">
  import { ColorPicker } from "@isolde/ui/components/custom/colorPicker";
  import { themeStore, updateThemeOption, setTheme } from "$lib/stores/theme";
</script>

<div class="bg-elevation-1 w-full">
  <h1>Settings elevation 1</h1>
  <div class="bg-elevation-2 w-full">
    <h1>elevation 2</h1>
    <div class="bg-elevation-3 w-full">
      <h1>elevation 3</h1>
      <div class="bg-elevation-4 w-full">
        <h1>elevation 4</h1>
        <div class="bg-elevation-5 w-full">
          <h1>elevation 5</h1>
          <ColorPicker {themeStore} {updateThemeOption} {setTheme} />
        </div>
      </div>
      <p>
        lower surface blend on dark mode and make it higher on light mode for
        better theme, ofc this will need tweaking so yeah i'll figure it out
      </p>
    </div>
  </div>
  <p>
    surface blend 1 and dark background boost .8 gives amazing results on light
    mode, i might use that as the basis
  </p>
</div>
