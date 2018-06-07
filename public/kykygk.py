highest_index = 0
lowest_index = 0

highest_win = 0
highest_loss = 0

for index, point_scored in football.points_scored.items():
    if point_scored > highest_win:
        highest_win = point_scored
        highest_index = index

    if football.points_allowed.loc[index] > highest_loss:
        highest_loss = football.points_allowed.loc[index]
        lowest_index = index

    if point_scored > football.points_allowed.loc[index]:
        print('game won')
    elif point_scored == football.points_allowed.loc[index]:
        print("game tied")
    else:
        print('game lost')


football[highest_index : highest_index+1]
football[lowest_index : lowest_index+1]