# Nearest Similar Units

## Problem Statement
Sonder is a hospitality platform where guests can book units. Sonder is adding new units all the time. When guests book units, they sometimes want to explore other similar options.

Your task is to build a unit manager (in memory, no persistence). This unit manager and the units its stores should supports several operations:

    UnitManager#add_unit(Unit unit)

Adds a Unit instance to a UnitManager instance.

    UnitManager#nearest_similar_units(Unit unit, int limit)

Returns the nearest units that are similar to unit. Cap the results by limit. You are free to define what "similar" means.
Two possible methods for approximating the distance between units are [Euclidean Distance](https://en.wikipedia.org/wiki/Euclidean_distance) or the [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula).

## What You Get
You are provided units serialized as JSON in a small file and a large one. Each unit looks something like this:

    { "id": 2, "address": "8203 Wild Horse Dr", "baths": 2.0, "beds": 3, "city": "San Francisco, CA", "floor": 5, "has_elevator": 0, "has_parking": 1, "has_pool": 1, "has_view": 1, "lat": 37.786979969349275, "lng": -122.4884704600913, "square_feet": 1041.0 }