exports.parse = function (configuration) {
    var command_list = "";
    if ("esp-group" in configuration) {
        command_list += parse_esp(configuration['esp-group']);
    }
    if ("ike-group" in configuration) {
        command_list += parse_ike(configuration['ike-group']);
    }
    if ("site-to-site" in configuration) {
        for (var i = 0; i < configuration["site-to-site"].length; i++) {
            command_list += parse_site(configuration["site-to-site"][i]);
        }

    }


    console.log(command_list);
}

function parse_esp(esp_configuration) {
    var command_list = "";
    var name = esp_configuration.name;
    var command_base = "set security vpn ipsec esp-group " + name + " ";

    if ("lifetime" in esp_configuration) {
        command_list += command_base + "lifetime " + esp_configuration.lifetime + "\n";
    }

    if ("pfs" in esp_configuration) {
        command_list += command_base + "pfs " + esp_configuration.pfs + "\n";
    }

    for (var i = 0; i < esp_configuration.proposals.length; i++) {
        var proposal_base = command_base + "proposal " + (i + 1) + " ";
        // get a list of all the keys in this proposal
        keys = Object.keys(esp_configuration.proposals[i]);
        for (var j = 0; j < keys.length; j++) {
            command_list += proposal_base + keys[j] + " " + esp_configuration.proposals[i][keys[j]] + "\n"
        }
    }

    return command_list;
}

function parse_ike(ike_configuration) {
    var command_list = "";
    var name = ike_configuration.name;
    var command_base = "set security vpn ipsec ike-group " + name + " ";

    if ("lifetime" in ike_configuration) {
        command_list += command_base + "lifetime " + ike_configuration.lifetime + "\n";
    }

    if ("ike-version" in ike_configuration) {
        command_list += command_base + "ike-version " + ike_configuration['ike-version'] + "\n";
    }

    for (var i = 0; i < ike_configuration.proposals.length; i++) {
        var proposal_base = command_base + "proposal " + (i + 1) + " ";
        // get a list of all the keys in this proposal
        keys = Object.keys(ike_configuration.proposals[i]);
        for (var j = 0; j < keys.length; j++) {
            command_list += proposal_base + keys[j] + " " + ike_configuration.proposals[i][keys[j]] + "\n"
        }
    }

    return command_list;
}

function parse_site(site_configuration) {
    var peer = site_configuration.peer;
    var command_list = "";
    var command_base = "set security vpn ipsec site-to-site peer " + peer + " ";

    // add authentication 
    command_list += command_base + "authentication mode pre-shared-secret" + "\n";
    command_list += command_base + "authentication pre-shared-secret" + site_configuration['pre-shared-key'] + "\n";

    // set the local address
    command_list += command_base + "local-address " + site_configuration['local-address'] + "\n";

    // set the IKE group
    command_list += command_base + "ike-group " + site_configuration['ike-group'] + "\n";

    // set the default ESP group
    if ("default-esp-group" in site_configuration) {
        command_list += command_base + "default-esp-group " + site_configuration['default-esp-group'] + "\n";
    }

    // iterate through the tunnels
    for (var i = 0; i < site_configuration.tunnels.length; i++) {
        var tunnel_base = command_base + "tunnel " + (i + 1) + " ";
        keys = Object.keys(site_configuration.tunnels[i]);
        for (var j = 0; j < keys.length; j++) {
            command_list += tunnel_base + keys[j] + " " + site_configuration.tunnels[i][keys[j]] + "\n"
        }
    }

    return command_list;

}