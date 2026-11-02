# Run with: ruby -Ilib test/ejectable_test.rb
require "minitest/autorun"
require "generators/madmin_inertia/ejectable"

class EjectableTest < Minitest::Test
  def rewrite(line)
    line.gsub(%r{from "#{MadminInertia::Generators::Ejectable::GEM_IMPORT}"}, 'from "madmin-inertia"')
  end

  def test_gem_subpath_imports_come_from_the_package
    assert_equal 'import { Card } from "madmin-inertia"', rewrite('import { Card } from "@/components/ui/card"')
    assert_equal 'import { Field } from "madmin-inertia"', rewrite('import { Field } from "@/components/field"')
    assert_equal 'import { buttonClass } from "madmin-inertia"', rewrite('import { buttonClass } from "@/lib/ui"')
  end

  def test_other_imports_are_untouched
    assert_equal 'import x from "./local"', rewrite('import x from "./local"')
  end
end
