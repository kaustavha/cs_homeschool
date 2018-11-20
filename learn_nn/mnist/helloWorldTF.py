import tensorflow as tf

h = tf.constant("hello")
w = tf.constant(" world")

hw = h + w

print(hw)

print(tf.__version__)

with tf.Session() as sess:
    ans = sess.run(hw)

# Regression - linear
# Mapping a function to a bunch of values, trying to find best fit
# Regression - logistic - binomial
# building on that, function returns 0 or 1 dependent on data, different kind of fit
# Regression - softmax - multinomial
# building on that, generalization of logistic regression, 

print(ans)