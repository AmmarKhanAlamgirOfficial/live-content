document.addEventListener('DOMContentLoaded', () => {

    /**
     * This function is a direct adaptation of the parseContent function from your live.md file.
     * It takes raw text and converts it into fully rendered HTML, including all embeds.
     */
    function parseRawContent(rawText) {
        if (!rawText || typeof rawText !== 'string') return '';
        
        const placeholders = [];
        let tempContent = rawText;
        
        const allKeywords = 'twitter-video|twitter|instagram-video|instagram|facebook|youtube|tiktok|linkedin|reddit|telegram';
        const regex = new RegExp(`\\[(${allKeywords})\\|?(.*?)\\]\\((.*?)\\)|!\\[(.*?)\\]\\((.*?)\\)`, 'g');

        tempContent = tempContent.replace(regex, (match, socialType, socialDesc, socialUrl, imgAlt, imgUrl) => {
            let htmlBlock = '';
            const caption = socialDesc ? `<p class="media-caption">${socialDesc}</p>` : '';
            
            if (socialType) { // This is a social media embed
                switch (socialType) {
                    case 'youtube':
                        const ytMatch = socialUrl.match(/(?:v=|\/embed\/|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                        if (ytMatch && ytMatch[1]) {
                            htmlBlock = `<div class="responsive-iframe-container responsive-iframe-container-16x9 my-4"><iframe src="https://www.youtube.com/embed/${ytMatch[1]}" allowfullscreen></iframe></div>`;
                        }
                        break;
                    case 'twitter':
                    case 'twitter-video':
                        htmlBlock = `<div class="my-4"><blockquote class="twitter-tweet" data-dnt="true" data-theme="light"><a href="${socialUrl.replace('x.com', 'twitter.com')}"></a></blockquote></div>`;
                        break;
                    case 'instagram':
                    case 'instagram-video':
                         htmlBlock = `<div class="my-4"><blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="${socialUrl}" data-instgrm-version="14"></blockquote></div>`;
                        break;
                    case 'facebook':
                        htmlBlock = `<div class="my-4"><div class="fb-post" data-href="${socialUrl}" data-width="auto" data-show-text="true"></div></div>`;
                        break;
                }
                 if(htmlBlock && caption) {
                    htmlBlock = htmlBlock.replace(/(<\/div>)$/, `$1${caption}`);
                 }

            } else if (imgUrl) { // This is a standard image format ![alt](src)
                const captionHTML = (imgAlt && imgAlt.trim() !== '') ? `<p class="media-caption">${imgAlt}</p>` : '';
                htmlBlock = `<div class="my-4"><img src="${imgUrl}" alt="${imgAlt || ''}" class="my-0 mx-auto rounded-lg">${captionHTML}</div>`;
            }

            placeholders.push(htmlBlock);
            return `__PLACEHOLDER_${placeholders.length - 1}__`;
        });

        const processedText = tempContent.split('\n\n').map(paragraph => {
            if (paragraph.startsWith('__PLACEHOLDER_')) return paragraph;
            if (paragraph.trim() === '') return '';
            if (paragraph.startsWith('&gt;')) { // Jekyll escapes '>' to '&gt;'
                 return `<blockquote>${paragraph.substring(4).trim().replace(/\n/g, '<br>')}</blockquote>`;
            }
            return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
        }).join('');

        return processedText.replace(/__PLACEHOLDER_(\d+)__/g, (match, index) => placeholders[parseInt(index, 10)]);
    }

    function loadSocialScripts() {
        const scripts = {
            twitter: 'https://platform.twitter.com/widgets.js',
            instagram: '//www.instagram.com/embed.js',
            facebook: 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0'
        };
        if (document.querySelector('.twitter-tweet')) { const s = document.createElement('script'); s.src = scripts.twitter; s.async = true; document.body.appendChild(s); }
        if (document.querySelector('.instagram-media')) { const s = document.createElement('script'); s.src = scripts.instagram; s.async = true; document.body.appendChild(s); }
        if (document.querySelector('.fb-post')) { const s = document.createElement('script'); s.src = scripts.facebook; s.async = true; s.defer=true; s.crossOrigin="anonymous"; document.body.appendChild(s); }
    }

    // --- Main Execution ---
    document.querySelectorAll('.post-body').forEach(postBody => {
        // *** CRITICAL FIX: Use .innerHTML to get the raw content with newlines preserved ***
        const rawMarkdown = postBody.innerHTML.trim();
        const finalHtml = parseRawContent(rawMarkdown);
        postBody.innerHTML = finalHtml;
    });

    loadSocialScripts();

    setTimeout(() => {
        if (window.twttr?.widgets) window.twttr.widgets.load();
        if (window.instgrm?.Embeds) window.instgrm.Embeds.process();
        if (window.FB?.XFBML) window.FB.XFBML.parse();
    }, 500);
});
