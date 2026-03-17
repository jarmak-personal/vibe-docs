```{raw} html
<div class="cp-hero">
  <div class="cp-hero-content">
    <h1 class="cp-hero-title" data-glitch="vibe::geospatial">vibe::geospatial</h1>
    <p class="cp-hero-subtitle">
      GPU-accelerated geospatial for Python. Vector analytics, coordinate
      projections, and raster processing &mdash; all built on CUDA.
    </p>
  </div>
</div>
```

```{raw} html
<div class="cp-features cp-suite-cards">
  <a class="cp-card cp-card--vibespatial cp-reveal" href="https://jarmak-personal.github.io/vibeSpatial/">
    <div class="cp-card-accent"></div>
    <h3>vibeSpatial</h3>
    <p>
      GPU-accelerated spatial analytics. Drop-in GeoDataFrame with CUDA
      kernels for predicates, overlay, dissolve, buffer, and I/O.
    </p>
    <span class="cp-card-link">Docs &rarr;</span>
  </a>
  <a class="cp-card cp-card--vibeproj cp-reveal" href="https://jarmak-personal.github.io/vibeProj/">
    <div class="cp-card-accent"></div>
    <h3>vibeProj</h3>
    <p>
      GPU-accelerated coordinate projection. CUDA kernels for datum
      transforms, CRS conversion, and geodetic computations.
    </p>
    <span class="cp-card-link">Docs &rarr;</span>
  </a>
  <a class="cp-card cp-card--raster cp-reveal" href="https://jarmak-personal.github.io/vibeSpatial-Raster/">
    <div class="cp-card-accent"></div>
    <h3>vibeSpatial-Raster</h3>
    <p>
      GPU-accelerated raster processing. CUDA kernels for zonal stats,
      reclassification, focal operations, and terrain analysis.
    </p>
    <span class="cp-card-link">Docs &rarr;</span>
  </a>
</div>
```

## The Suite

The **vibe** projects are a family of GPU-first geospatial libraries for
Python. Each is designed from scratch around CUDA kernels and
[CCCL](https://nvidia.github.io/cccl/) primitives, with explicit CPU
fallback that is never silent and never the design center.

All three share the **NEON GRID** documentation theme, a common test
philosophy (upstream contract suites as the compatibility contract), and
the same performance-first engineering culture.

| Project | Domain | GPU Kernels |
|---------|--------|-------------|
| {external+vibespatial:doc}`vibeSpatial <index>` | Vector analytics | Predicates, overlay, dissolve, buffer, clip, I/O |
| {external+vibeproj:doc}`vibeProj <index>` | Projections | Datum transforms, CRS conversion, geodetics |
| {external+vibespatial-raster:doc}`vibeSpatial-Raster <index>` | Raster processing | Zonal stats, focal ops, reclassify, terrain |

## How they connect

The three projects exchange GPU-resident data without host round-trips:

- **vibeSpatial + vibeProj**: `GeoDataFrame.to_crs()` calls vibeProj's
  {external+vibeproj:doc}`transform_buffers() <user/vibespatial>` to
  reproject `OwnedGeometryArray` coordinate buffers directly on device.
- **vibeSpatial + Raster**: vibespatial-raster
  {external+vibespatial-raster:doc}`extends the vibespatial namespace <user/vibespatial>`
  and shares core modules (`residency`, `runtime`, `cuda_runtime`, `fusion`).
  `OwnedRasterArray` mirrors `OwnedGeometryArray`.
- **Raster + vibeProj**: Raster reprojection can chain through vibeProj
  for on-device CRS transforms of rasterized grid coordinates.

```{toctree}
:hidden:
:maxdepth: 1
```
