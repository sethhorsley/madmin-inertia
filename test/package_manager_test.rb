# Run with: ruby -Ilib test/package_manager_test.rb
require "minitest/autorun"
require "tmpdir"
require "madmin_inertia/package_manager"

class PackageManagerTest < Minitest::Test
  def manager(*files)
    Dir.mktmpdir do |root|
      files.each { |file| File.write(File.join(root, file), "") }
      yield MadminInertia::PackageManager.new(root)
    end
  end

  def test_detects_from_lockfile
    {"pnpm-lock.yaml" => :pnpm, "yarn.lock" => :yarn, "package-lock.json" => :npm, "bun.lockb" => :bun}.each do |file, expected|
      manager(file) { |pm| assert_equal expected, pm.name, file }
    end
  end

  def test_npm_links_with_file_and_runs_scripts_with_run
    manager("package-lock.json") do |pm|
      assert_equal "npm install a b", pm.add_command("a b")
      assert_equal "file:../gem", pm.link_spec("../gem")
      assert_equal "npm run build:css", pm.script_command("build:css")
    end
  end

  def test_pnpm_links_with_link_and_builds
    manager("pnpm-lock.yaml") do |pm|
      assert_equal "pnpm add a", pm.add_command("a")
      assert_equal "link:../gem", pm.link_spec("../gem")
      assert_equal "pnpm run build", pm.build_command
      assert_equal "pnpm build:css", pm.script_command("build:css")
    end
  end
end
