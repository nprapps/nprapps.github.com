module Jekyll
  class RelatedGenerator < Generator

    safe true
    priority :high

    N = 8

    def generate(site)
      site.posts.map! do |post|
        related = [ ]
        unless post.categories.empty?
          related += site.categories.map { |k,v|
            v if post.categories.include?(k) }.flatten.uniq.reject { |x|
            x.nil? || x.url == post.url }.sort.reverse.first(N)
        end
        post.data['related'] = related

        post
      end
    end

  end
end