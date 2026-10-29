require "pathname"

module MadminInertia
  # Detects the app's JS package manager from its lockfile, like jsbundling-rails does.
  # (Rails' own helpers for this aren't in a release yet.)
  class PackageManager
    MANAGERS = {
      bun: {add: "bun add %s", build: "bun run build", link: "link:%s"},
      pnpm: {add: "pnpm add %s", build: "pnpm run build", link: "link:%s"},
      npm: {add: "npm install %s", build: "npm run build", link: "file:%s"},
      yarn: {add: "yarn add %s", build: "yarn build", link: "link:%s"}
    }.freeze

    # @param root [Pathname, String] the app root
    def initialize(root)
      @root = Pathname(root)
    end

    # @return [Symbol] :bun, :pnpm, :npm or :yarn
    def name
      @name ||= if %w[bun.lock bun.lockb bun.config.js].any? { |file| @root.join(file).exist? } then :bun
      elsif @root.join("pnpm-lock.yaml").exist? then :pnpm
      elsif @root.join("package-lock.json").exist? then :npm
      elsif @root.join("yarn.lock").exist? then :yarn
      else %i[bun yarn pnpm npm].find { |executable| system("command -v #{executable} > /dev/null") } || :npm
      end
    end

    # @param packages [String] space-separated package specs
    # @return [String] the shell command that adds them
    def add_command(packages)
      MANAGERS.dig(name, :add) % packages
    end

    # @return [String] the shell command that runs the app's `build` script
    def build_command
      MANAGERS.dig(name, :build)
    end

    # @param path [Pathname, String] a local package directory, relative to the app
    # @return [String] the spec that links it, e.g. "link:../gem" (or "file:" for npm)
    def link_spec(path)
      MANAGERS.dig(name, :link) % path
    end

    # @return [String] the command that runs an arbitrary script, e.g. "build:css"
    def script_command(script)
      (name == :npm) ? "npm run #{script}" : "#{name} #{script}"
    end
  end
end
