"""Sphinx configuration for vibe suite landing page."""

project = "vibe"
copyright = "2025, vibe Contributors"
author = "vibe Contributors"
release = "0.1.0"

extensions = [
    "myst_parser",
    "sphinx_copybutton",
    "sphinx.ext.intersphinx",
]

myst_enable_extensions = [
    "colon_fence",
    "fieldlist",
    "html_admonition",
    "attrs_inline",
]

templates_path = ["_templates"]
exclude_patterns = ["_build"]

# -- Theme: Furo + NEON GRID overlay -----------------------------------------
html_theme = "furo"
html_title = "vibe"

html_static_path = ["_static"]
html_css_files = ["css/vibesuite.css"]
html_js_files = ["js/vibesuite.js"]

html_theme_options = {
    "light_css_variables": {},
    "dark_css_variables": {},
}

# Force dark mode default
html_context = {
    "default_mode": "dark",
}

# -- Intersphinx: cross-link to each project's docs --------------------------
intersphinx_mapping = {
    "vibespatial": ("https://jarmak-personal.github.io/vibeSpatial/", None),
    "vibeproj": ("https://jarmak-personal.github.io/vibeProj/", None),
    "vibespatial-raster": ("https://jarmak-personal.github.io/vibespatial-raster/", None),
}
