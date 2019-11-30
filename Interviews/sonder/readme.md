# Booking Assignments

## Problem Statement

At Sonder we somtimes list our units in groups rather than individually so that when a
guest makes a booking we can assign them to any unit in that group. 

A unit's calendar is represented as an array of 15 values in which each value corresponds to
a day of the month. A booking is represented in one of these calendars as a sequence of the 
same integer (a.k.a. booking ID); the length of the sequence indicates the number of nights booked.
For example, the sequence [1, 1, 1] indicates a 3 night stay.

Given a list of existing Units' calendars and a list of new bookings to assign, implement a solution
that will allocate each booking to a unit as optimally as possible and print the new calendars.

Guidelines:
1. Existing bookings can be moved to other units.  
2. 
2. Bookings (i.e. consecutive sequences of the same integer) cannot be broken up.  
3. Unit calendars are the most optimal when the number of small gaps in the  
calendar (say < 2 nights) is minimized.  

## Examples

## Small

Input:

    units = [
        [241, 241, 241, 0,   0, 367, 367, 0, 0, 198, 198, 198, 0, 0, 0], 
        [0,   0,   193, 193, 0, 0,   0,   0, 0, 0,   0,   0,   0, 0, 0], 
    ]
    bookings = [
        { "id": 729, "check_in": 3, "check_out": 5 },
        { "id": 184, "check_in": 6, "check_out": 7 },
        { "id": 399, "check_in": 8, "check_out": 13 },
    ]

One possible output:

    Unit 1  241   241   241   729   729   376   376   -    -    198   198   198    -    -    - 
    Unit 2   -     -    193   193    -     -    184   -   399   399   399   399   399   -    - 

### Medium

Input:

    units = [
        [900, 900, 900, 0,   281, 281, 0,   0,   0,   831, 831, 831, 0,   0, 0],
        [0,   0,   0,   768, 0,   278, 465, 465, 465, 0,   0,   0,   444, 0, 0] 
    ]
    bookings = [
        { "id": 983, "check_in": 3, "check_out": 5 },
        { "id": 290, "check_in": 0, "check_out": 3 },
        { "id": 100, "check_in": 12, "check_out": 14 }
    ]

One possible output:

    Unit 1   900  900  900  768  281  281   -   107  107  831  831  831  444   -    - 
    Unit 2   290  290  290  983  983  278  465  465  465   -    -    -   100  100   -


### Large
Input:

    units = [
        [0, 190, 0,  0,   680, 680, 0,   0,   902, 0,   397, 0, 700, 0,   459],
        [0, 0,   0,  0,   166, 166, 166, 0,   0,   601, 0,   0, 358, 0,   129],
        [0, 757, 0,  130, 130, 130, 0,   0,   0,   0,   561, 0, 0,   735, 0],
        [0, 0,   0,  0,   0,   0,   723, 723, 0,   0,   0,   0, 0 ,  0,   0]
    ]
    bookings = [
        { "id": 289, "check_in": 0, "check_out": 2 },
        { "id": 678, "check_in": 1, "check_out": 2 },
        { "id": 800, "check_in": 5, "check_out": 9 },
        { "id": 222, "check_in": 7, "check_out": 11 },
        { "id": 685, "check_in": 7, "check_out": 13 },
    ]

One possible output (dates at the top are optional):

    Unit 1    -   190   -    -    680   680    -     -     -    -    -    -   700   685   459
    Unit 2   289  289   -    -    166   166   166   222   222  222  222   -   358   735  129
    Unit 3   -    757   -   130   130   130   723   723   902  601  561   -    -    -     -
    Unit 4   -    678   -    -     -    800   800   800   800   -   397   -    -    -     -