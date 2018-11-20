#%%
import math

# Return values follow an S shaped curve
# Rapid changes from 0 to 1
def Sigmoid(z):
    return float(1.0 / float(1.0 + math.exp(-1.0*z)))

for x in range(-10, 10):
    print('%d : %f' % (x, Sigmoid(x)))

NUM_STEPS = 1000
MINIBATCH_SIZE = 100
sess = tf.InteractiveSession()
tf.global_variables_initializer().run()
for _ in range(NUM_STEPS):
  batch_xs, batch_ys = data.train.next_batch(MINIBATCH_SIZE)
  sess.run(gd_step, feed_dict={x: batch_xs, truth: batch_ys})
# y_ = truth