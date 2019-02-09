# -*- coding: UTF-8 -*-
import sys
import numpy as np
import torch
from torch.autograd import Variable
# from visdom import Visdom # pip install Visdom
import captcha_setting
import my_dataset
import one_hot_encoding;
from captcha_cnn_model import CNN


def main(image_path):
    cnn = CNN()
    cnn.eval()
    cnn.load_state_dict(torch.load('model.pkl'))

    predict_dataloader = my_dataset.get_predict_data_loader(image_path)

    for i, (images, labels) in enumerate(predict_dataloader):
        image = images
        vimage = Variable(image)
        predict_label = cnn(vimage)

        c0 = captcha_setting.ALL_CHAR_SET[np.argmax(predict_label[0, 0:captcha_setting.ALL_CHAR_SET_LEN].data.numpy())]
        c1 = captcha_setting.ALL_CHAR_SET[np.argmax(
            predict_label[0, captcha_setting.ALL_CHAR_SET_LEN:2 * captcha_setting.ALL_CHAR_SET_LEN].data.numpy())]
        c2 = captcha_setting.ALL_CHAR_SET[np.argmax(
            predict_label[0, 2 * captcha_setting.ALL_CHAR_SET_LEN:3 * captcha_setting.ALL_CHAR_SET_LEN].data.numpy())]
        c3 = captcha_setting.ALL_CHAR_SET[np.argmax(
            predict_label[0, 3 * captcha_setting.ALL_CHAR_SET_LEN:4 * captcha_setting.ALL_CHAR_SET_LEN].data.numpy())]

        c = '%s%s%s%s' % (c0, c1, c2, c3)
        print(c)

if __name__ == '__main__':
    main(sys.argv[1])
