import { build, context } from "esbuild";

// Public Velo module: no DOM, CSS, backend API or third-party runtime imports.
const contentOptions = { entryPoints: ['src/content/program-content.js'], outfile: 'dist/arista-program-content.js', bundle: true, format: 'esm', platform: 'neutral', target: 'es2020' };
const seoOptions = { entryPoints: ['src/seo/markup.js'], outfile: 'dist/arista-seo.js', bundle: true, format: 'esm', platform: 'neutral', target: 'es2020' };

const options = {
  entryPoints: ["src/components/arista-home.js", "src/components/arista-program.js"],
  outdir: "dist",
  bundle: true,
  splitting: false,
  format: "iife",
  platform: "browser",
  target: ["es2020"],
  minify: !process.argv.includes("--watch"),
  // Embed CSS strings in Shadow DOM: Wix only needs this one JavaScript URL.
  loader: { ".css": "text" },
  logLevel: "info",
};

if (process.argv.includes("--watch")) {
  const builder = await context(options);
  const contentBuilder = await context(contentOptions);
  const seoBuilder = await context(seoOptions);
  await builder.rebuild();
  await contentBuilder.rebuild();
  await seoBuilder.rebuild();
  await builder.watch();
  await contentBuilder.watch();
  await seoBuilder.watch();
  console.info(
    "Watching source files. Serve the project root with Live Server, then reload Wix Preview after saving.",
  );
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.once(signal, async () => {
      await builder.dispose();
      await contentBuilder.dispose();
      await seoBuilder.dispose();
      process.exit(0);
    });
  }
} else {
  await build(contentOptions);
  await build(seoOptions);
  await build(options);
}
