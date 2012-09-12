module Jekyll

  Page.class_eval {
  
    def clone
      Page.new(@site, @base, @dir, @name)
    end

  }

  class CategoryPageGenerator < Generator
    safe true
    priority :high

    def generate(site)
      main_cat_page = site.pages.select { |p| p.name == "category_index.html" }.first

      site.categories.each do |cat|
        cat_page = main_cat_page.clone
        cat_name = cat.first.gsub(/\s+/, '-')

        cat_page.data.merge!(
          "title" => "apps.blog.npr.org category: #{cat_name}",
          "permalink" => "/category/#{cat_name}/",
          "category_name" => cat_name)
        cat_page.render(site.layouts, site.site_payload)

        site.pages << cat_page
      end

    end

  end
end