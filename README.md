# yashikota.com

<https://yashikota.com>

## Dependencies

- Bun
- Astro
- shadcn/ui
- Tailwind

## Setup

1. `aqua i`
2. `bun i`
3. `bun dev`

## Convert

### Image

```sh
convert input.jpg -quality 70 output.avif
```

### Video

```sh
ffmpeg -y -i input.mp4 -c:v libsvtav1 -crf 35 output.avif
```

```sh
ffmpeg -y -i input.gif -c:v libaom-av1 -crf 35 output.avif
```
