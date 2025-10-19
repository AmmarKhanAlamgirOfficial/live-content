module Jekyll
  module CustomEmbeds
    # This filter finds special links like [youtube](url) and replaces them with HTML.
    def parse_embeds(input)
      # Regex to find your specific embed format: [platform|caption](url)
      # It specifically looks for a keyword followed by a URL in parentheses.
      input.gsub(/\[(youtube|twitter|twitter-video|instagram|instagram-video|facebook|tiktok|telegram)\|?(.*?)?\]\((.*?)\)/) do |match|
        platform = $1.downcase
        caption = $2
        url = $3
        
        html_output = ""
        
        case platform
        when 'youtube'
          video_id_match = url.match(/(?:v=|\/embed\/|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
          if video_id_match
            video_id = video_id_match[1]
            html_output = %(<div class="responsive-iframe-container responsive-iframe-container-16x9 my-4"><iframe src="https://www.youtube.com/embed/#{video_id}" allowfullscreen></iframe></div>)
          end
        when 'twitter', 'twitter-video'
          html_output = %(<div class="my-4"><blockquote class="twitter-tweet" data-dnt="true" data-theme="light"><a href="#{url}"></a></blockquote></div>)
        when 'instagram', 'instagram-video'
           html_output = %(<div class="my-4"><blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="#{url}" data-instgrm-version="14"></blockquote></div>)
        when 'facebook'
            html_output = %(<div class="my-4"><div class="fb-post" data-href="#{url}" data-width="auto" data-show-text="true"></div></div>)
        end

        # Add the caption if one was provided
        if caption && !caption.empty?
            html_output += %(<p class="media-caption">#{caption}</p>)
        end
        
        # If we generated HTML, return it. Otherwise, return the original match (should not happen with this regex).
        html_output.empty? ? match : html_output
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::CustomEmbeds)
