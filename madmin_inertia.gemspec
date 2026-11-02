require_relative "lib/madmin_inertia/version"

Gem::Specification.new do |spec|
  spec.name = "madmin_inertia"
  spec.version = MadminInertia::VERSION
  spec.summary = "Inertia + React rendering for Madmin resources"
  spec.authors = ["Seth Horsley"]
  spec.homepage = "https://github.com/sethhorsley/madmin-inertia"
  spec.license = "MIT"
  spec.required_ruby_version = ">= 3.2"
  spec.files = Dir["{app,config,lib}/**/*", "index.jsx", "package.json", "tsconfig.json", "README.md", "LICENSE"]

  spec.metadata = {"source_code_uri" => spec.homepage, "rubygems_mfa_required" => "true"}

  spec.add_dependency "rails", ">= 7.2"
  spec.add_dependency "madmin", "~> 3.3"
  spec.add_dependency "inertia_rails", "~> 3.22"
end
