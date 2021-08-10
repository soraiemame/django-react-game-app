import random


#  k wolfs from n players
def generate_random_wolf(n, k):
    bits = [0] * n
    for i in range(k):
        bits[i] = 1
    random.shuffle(bits)
    res = 0
    for i in range(n):
        res |= bits[i] << i
    return res


#  (wolf, others)
def generate_random_theme():
    return 'Python', 'C++'
