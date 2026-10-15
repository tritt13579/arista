import { build, context } from "esbuild";

const options = {
  entryPoints: ["src/components/arista-home.js"],
  outfile: "dist/arista-home.js",
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
  await builder.rebuild();
  await builder.watch();
  console.info(
    "Watching source files. Serve the project root with Live Server, then reload Wix Preview after saving.",
  );
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.once(signal, async () => {
      await builder.dispose();
      process.exit(0);
    });
  }
} else {
  await build(options);
}
