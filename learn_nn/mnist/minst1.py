import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data

DATA_DIR = '/tmp/data'
NUM_STEPS = 1000
MINIBATCH_SIZE = 100


# one hot vectors are vectos which are 0 in most dims but 1 in a few
# imagine slicing the 28x28 picture into thin 1 pixel strips, and attaching them together
# black marks will be 1s, blank space is a 0
# Think of a simple visual cortex which can only interpret 2 colors, e.g. a dogs
data = input_data.read_data_sets(DATA_DIR, one_hot=True)

# each image will fill list of len 784 (28x28 pixels)
# But we do not know how many images we will unroll to linear tensors
x = tf.placeholder(tf.float32, [None, 784])

# variable that will be used for computation, 
# 10 possible states to reduce the 784 pixel input to
# W will learn and change from 0s to become more accurate at prediction
# b will be used to add to output
W = tf.Variable(tf.zeros([784, 10]))
b = tf.Variable(tf.zeros([10]))

# y true will be read from data labels
y_true = tf.placeholder(tf.float32, [None, 10])

# y_pred is what we will try to predict, 
# we create logits from our linear combination of vairables
# A logit func links our linear combination of variables onto a binary 0-1 bernouili distribution 
# similiar to a sigmoid function
# an inverse logit is also called the mean function
y_pred = tf.matmul(x, W)

# cross entropy / loss function
# Softmax: generalized logistic regression which outputs different classes
# We add up evidence we have and convert it to probabilities for different classes
# y = softmax(Wx + b)

# A logit func links our linear combination of variables onto a binary 0-1 bernouili distribution 
# similiar to a sigmoid function
# an inverse logit is also called the mean function
# simply a matrix multibly and a bias
logits = tf.matmul(x, W) + b

# We feed in the logits to derive the probabilities
# cross entropy / loss function
# Softmax: generalized logistic regression which outputs different classes
# We add up evidence we have and convert it to probabilities for different classes
# y = softmax(Wx + b)
# We get the cross-entropy which is the difference between our labels and distribution generated by running softmax over the logits
# Softmax gaurentees a little probability, whereas our labels are one hot encoded so 1 or 0
cross_entropy = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(
    logits=y_pred, labels=y_true))

# Once we've set up our computational graph we're ready to set up actions on it
# We'll apply gradient descent, a glorified chain rule algorithm to 
# traverse the graph, taking derivatives backwards instead of forwards
# all while minimizing cross entropy
gd_step = tf.train.GradientDescentOptimizer(0.5).minimize(cross_entropy)

correct_mask = tf.equal(tf.argmax(y_pred, 1), tf.argmax(y_true, 1))
accuracy = tf.reduce_mean(tf.cast(correct_mask, tf.float32))

with tf.Session() as sess:

    # Train
    sess.run(tf.global_variables_initializer())

    for _ in range(NUM_STEPS):
        batch_xs, batch_ys = data.train.next_batch(MINIBATCH_SIZE)
        sess.run(gd_step, feed_dict={x: batch_xs, y_true: batch_ys})

    # Test
    ans = sess.run(accuracy, feed_dict={x: data.test.images, 
                                        y_true: data.test.labels})

print "Accuracy: {:.4}%".format(ans*100)