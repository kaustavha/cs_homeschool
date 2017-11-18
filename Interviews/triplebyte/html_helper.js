const url_lib = require('url');

module.exports.get_neighbors = function(body_str, url) {
    const paths_to_follow = get_url_strings_from_doc(body_str);

    return get_urls_from_page(paths_to_follow, url);
}

function clean_up_href(href) {
    if (href.includes("#")) href = href.split("#")[0];
    // Browsers do all kinds of crazy things to make their hrefs valid even when
    // they're sketchy. For example, spaces get autoescaped on Chrome.
    return href.replace(/ /, '%20');
}
module.exports.clean_up_href = clean_up_href;

function absolutize_path(path, base_path) {
    if (path && path[0] !== '/' || path.startsWith('/.')) {
        const sections = base_path.replace(/\/([^/]*)$/, '').split('/').concat(path.split('/'));
        let out = [];
        sections.forEach(section => {
            if (section == '.' || section == '') {
                // Do nothing.
            } else if (section == '..') {
                out.pop();
            } else {
                out.push(section);
            }
        });

        return '/' + out.join('/');
    } else {
        return path;
    }
}
module.exports.absolutize_path = absolutize_path;

function clean_up_parsed_url(parse) {
    // url_lib leaves separator characters in url parts - clean them up here
    const ret = Object.assign({}, parse);
    const protocol = ret.protocol;
    const search = ret.search;
    const fragment = ret.fragment;

    if (protocol) {
      ret.protocol = protocol.substring(0, protocol.length - 1);
    };

    if (search) {
      ret.search = search.substring(1);
    }

    if (fragment) {
      ret.fragment = fragment.substring(1);
    }

    return ret;
}

function get_urls_from_page(paths_to_follow, url) {
    console.log("get_urls_from_page:", url);
    const parsed_parent_url = url_lib.parse(url);

    let out = [];
    let errors = [];

    paths_to_follow.forEach(href => {
        href = clean_up_href(href);

        let parsed_child_url = url_lib.parse(href);
        parsed_child_url = clean_up_parsed_url(parsed_child_url);

        // This is a regular expression which checks that a section of a URL only
        // has valid characters in it.
        const valid_section_regex = /^[a-zA-Z0-9.-_~!$&'()*+,;=@-]*$/;

        const url_part_keys = ['protocol', 'hostname', 'path', 'query', 'hash'];

        const invalid_url = url_part_keys.map(url_part_key => {
            return parsed_child_url[url_part_key] || '';
        }).filter(url_part => {
            return url_part.match(valid_section_regex) == null;
        }).length !== 0;

        if (invalid_url) {
            errors.push(`The page ${url} has an href of ${href}, which is invalid`);
            return;
        }

        if (href.startsWith('mailto')) {
            return;
        }

        if (parsed_child_url.href === '#') {
            return;
        }

        // Empty the hash.
        parsed_child_url.hash = '';

        // Default scheme is http.
        if (!parsed_child_url.protocol) {
            parsed_child_url.protocol = 'http';
        }

        // If the host was unspecified, copy the host of
        // the parent url.
        if (!parsed_child_url.hostname) {
            parsed_child_url.pathname = absolutize_path(parsed_child_url.pathname,
                                                        parsed_parent_url.pathname);
            parsed_child_url.hostname = parsed_parent_url.hostname;
            parsed_child_url.protocol = parsed_parent_url.protocol;
        }

        out.push(url_lib.format(parsed_child_url));
    });

    if (!out) {
        out = [];
    }

    return { out, errors };
}

function all_group_matches_with_regex(regex, str) {
    let matches, output = [];
    while (matches = regex.exec(str)) {
        output.push(matches[1]);
    }
    return output;
}

function get_hrefs_from_a_tags(body_str) {   
     console.log("get_hrefs_from_a_tags");
     let x = all_group_matches_with_regex(/<a [^>]*href="([^"]*)"/g, body_str);
    console.log(x);
    return x;
}

function get_hrefs_from_link_tags(body_str) {
    return all_group_matches_with_regex(/<link [^>]*href="([^"]*)"/g, body_str);
}

function get_srcs_from_script_tags(body_str) {
    return all_group_matches_with_regex(/<script [^>]*src="([^"]*)"/g, body_str);
}

function get_url_strings_from_doc(body_str) {
    console.log("get_url_strings_from_doc");
    return get_srcs_from_script_tags(body_str).
        concat(get_hrefs_from_a_tags(body_str)).
        concat(get_hrefs_from_link_tags(body_str));
}
module.exports.get_url_strings_from_doc = get_url_strings_from_doc;
