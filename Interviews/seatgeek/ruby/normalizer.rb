class Normalizer

    def initialize
    end

    ## reads a manifest file
    # manifest should be a CSV containing the following columns
    #     * section_id
    #     * section_name
    #     * row_id
    #     * row_name

    # Arguments:
    #     manifest {[str]} -- /path/to/manifest
    def read_manifest(path_to_manifest)
        ## your code goes here
    end


    ## normalize a single (section, row) input
    # Given a (Section, Row) input, returns (section_id, row_id, valid)
    # where
    #     section_id = int or None
    #     row_id = int or None
    #     valid = True or False

    # Arguments:
    #     section {[type]} -- [description]
    #     row {[type]} -- [description]
    def normalize(section, row)
        ## your code goes here
        return [nil, nil, false]
    end
end
