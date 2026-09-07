# Food photos

Drop Priya's photos in this folder, then point `src/lib/site.ts` at them.

For each dish, set the `image` field on that dish from `null` to the path:

```ts
image: "/images/chicken-tikka-masala.jpg",
```

Suggested filenames (any format works — .jpg, .png, .webp):

- chicken-tikka-masala.jpg
- keema-chicken.jpg
- chhole-masala.jpg

Shoot them straight down onto the bowl if you can — the layout crops each photo
to a circle inside a brass rim, so a centred, square-ish composition works best.
Aim for at least 800x800 pixels.

Until a photo is set, the site draws an illustrated bowl for that dish, so the
page never shows an empty placeholder.
